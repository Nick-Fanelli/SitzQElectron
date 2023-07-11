import { createContext, useState } from 'react'
import './App.css'

type ThemeContext = {
    theme: string,
    toggleTheme: Function
}

export const ThemeContext = createContext<ThemeContext>({
    theme: "light",
    toggleTheme: () => {}
});

function App() {

    const [ theme, setTheme ] = useState<string>("dark");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>

            <div id="root" className={`theme-${theme}`}>

                <h1>Hello World</h1>
                <button>Hello World</button>
                <br />
                <input type="text" placeholder="Hello World" />

            </div>

        </ThemeContext.Provider>
    )
}

export default App
