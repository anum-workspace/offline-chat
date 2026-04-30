import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@context/AppContext';
import Layout from '@components/Layout';
import ChatPage from '@pages/ChatPage';
import SettingsPage from '@pages/SettingsPage';
import ModelsPage from '@pages/ModelsPage';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/models" element={<ModelsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
