import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
 
import { GenresProvider } from './contex/genres.contex.tsx'
import { SearchResultProvider } from './contex/searchResult.context.tsx'
import { WatchlistProvider } from './contex/watchlist.context.tsx'
import { DetailsProvider } from './contex/details.context.tsx'
 



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <SearchResultProvider>
    <GenresProvider>
    <WatchlistProvider>
    <DetailsProvider>
      <App />
    </DetailsProvider>
    </WatchlistProvider>
    </GenresProvider>
    </SearchResultProvider>
    </BrowserRouter>
  </StrictMode>,
)
