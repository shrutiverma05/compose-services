import uvicorn
import os
from haystack.document_stores import ElasticsearchDocumentStore
from haystack.nodes import EmbeddingRetriever
from fastapi import BackgroundTasks, FastAPI
import pandas as pd
import urllib.request

data_file = 'faq_data.csv'
host = os.environ.get("ELASTICSEARCH_HOST", "localhost")
hostedserverUrl = "https://novacorpweb.azurewebsites.net/"

def download(data_file,index_name):
    url = hostedserverUrl+index_name+'/'+data_file
    print(url)
    urllib.request.urlretrieve(url, data_file)
    
def train(data_file,index_name,retriever,document_store):
    download(data_file,index_name)
    print('download done')
    df = pd.read_csv(data_file)
    df.fillna(value="", inplace=True)
    df["question"] = df["question"].apply(lambda x: x.strip())

    # Get embeddings for our questions from the FAQs

    questions = list(df["question"].values)
    print('before try')
    try:
        df["question_emb"] = retriever.embed_queries(queries=questions).tolist()
    except:
        df["question_emb"] = retriever.embed_queries(texts=questions)
    df = df.rename(columns={"question": "content"})
    print('after try')

    # Convert Dataframe to list of dicts and index them in our DocumentStore

    docs_to_index = df.to_dict(orient="records")
    print('second last')
    document_store.write_documents(docs_to_index)
    print('last')

app = FastAPI()


@app.post("/search/{index_name}", status_code=202)
async def index(index_name, background_tasks: BackgroundTasks):
    document_store = (ElasticsearchDocumentStore(
        host=host,
        username="",
        password="",
        index=index_name,
        embedding_field="question_emb",
        embedding_dim=384,
        excluded_meta_data=["question_emb"],
        similarity="cosine",
    ))
    retriever = (EmbeddingRetriever(
        document_store=document_store,
        embedding_model="sentence-transformers/all-MiniLM-L6-v2",
        use_gpu=True,
        scale_score=False,
    ))
    print('document store and retriever initialized')
    background_tasks.add_task(train, data_file, index_name, retriever, document_store)
    return f"Training started for {index_name}"


if __name__ == "__main__":
    uvicorn.run("Haystack:app", host="0.0.0.0", port=8001)