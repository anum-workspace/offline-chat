import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [modelStatus, setModelStatus] = useState({ initialized: false, modelName: null });

  useEffect(() => {
    loadChats();
    checkModelStatus();
  }, []);

  const loadChats = async () => {
    try { setChats(await window.api.getChats() || []); } catch (e) { console.error(e); }
  };

  const checkModelStatus = async () => {
    try { setModelStatus(await window.api.getModelStatus()); } catch (e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{ chats, setChats, currentChat, setCurrentChat, modelStatus, setModelStatus, loadChats, checkModelStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
