import { createContext, useState } from 'react'

import CueListComponent from './Components/CueListComponent'

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
                <CueListComponent />
            </div>

        </ThemeContext.Provider>
    )
}

export default App
