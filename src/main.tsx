import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import Genres from './components/Genres.tsx'
import { GenresProvider } from './contex/genres.contex.tsx'
import { SearchResultProvider } from './contex/searchResult.Context.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <SearchResultProvider>
    <GenresProvider>
    <App />
    </GenresProvider>
    </SearchResultProvider>
    </BrowserRouter>
  </StrictMode>,
)
