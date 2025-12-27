import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
 
import { GenresProvider } from './contex/genres.contex.tsx'
import { SearchResultProvider } from './contex/searchResult.context.tsx'
import { WatchlistProvider } from './contex/watchlist.context.tsx'
import { DetailsProvider } from './contex/details.context.tsx'
import { WatchProgressProvider } from './contex/watchProgress.context.tsx'
import { FilterProvider } from './contex/filters.context.tsx'
 



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <SearchResultProvider>
    <GenresProvider>
    <WatchlistProvider>
    <WatchProgressProvider>
    <FilterProvider>
    <DetailsProvider>
      <App />
    </DetailsProvider>
    </FilterProvider>
    </WatchProgressProvider>
    </WatchlistProvider>
    </GenresProvider>
    </SearchResultProvider>
    </BrowserRouter>
  </StrictMode>,
)
