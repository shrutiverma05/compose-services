import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toJSON } from 'css-convert-json';
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => sessionStorage.getItem('user') ? sessionStorage.getItem('user') : "");
    const [botProp, setBotProp] = useState(() => sessionStorage.getItem('botProp') ? JSON.parse(sessionStorage.getItem('botProp')) : null);
    const [botCss, setBotCss] = useState(() => sessionStorage.getItem('botCss') ? JSON.parse(sessionStorage.getItem('botCss')) : null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    let loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(e.target.userEmail.value)
        setUser(e.target.userEmail.value)
        // console.log(name)
        // console.log(user)
        let response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'userID': e.target.userEmail.value, 'password': e.target.userPassword.value })
        })
        const data = await response.json();
        if (response.status === 200) {
            console.log(user)
            const botCssJson = toJSON(data.botCss);
            setBotProp(data.botProp)
            setBotCss(botCssJson)
            sessionStorage.setItem("botCss", JSON.stringify(botCssJson))
            sessionStorage.setItem("botProp", JSON.stringify(data.botProp))
            sessionStorage.setItem("user", user)
            setError(false)
            setLoading(false)
            navigate("/dashboard");
        } else {
            setError(true)
            setLoading(false)
        }
    }

    let logoutUser = () => {
        setUser(null)
        setBotProp(null)
        setBotCss(null)
        setLoading(false);
        setError(false);
        sessionStorage.removeItem('botCss')
        sessionStorage.removeItem('botProp')
        sessionStorage.removeItem('user')
        navigate('/')
    }
    let contextData = {
        user: user,
        botProp: botProp,
        botCss: botCss,
        loading: loading,
        error: error,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }
    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}