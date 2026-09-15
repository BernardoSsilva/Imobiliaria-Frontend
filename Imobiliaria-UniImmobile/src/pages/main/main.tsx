import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../../styles/index.css'
import { AdminPages } from '../Admin/adminPages/adminPages.tsx'
import { LoginPage } from '../Admin/Login/Login.tsx'
import { Home } from '../UserPage/Home/Home'
import ImmobileDetail from "../UserPage/ImmobileDetail/ImmobileDetail";

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { enableMocks } = await import('../../mocks/mockAdapter');
    enableMocks();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<LoginPage />} />
        <Route path='/admin/pages' element={<AdminPages />} />
        <Route path="/immobile/:id" element={<ImmobileDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

bootstrap()
