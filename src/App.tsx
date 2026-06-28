import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth";
import CharacterForm from "./pages/CharacterForm";
import Characters from "./pages/Characters";
import Chat from "./pages/Chat";
import ChatCustomization from "./pages/ChatCustomization";
import Chats from "./pages/Chats";
import Start from "./pages/Start";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/new" element={<CharacterForm />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/chat/:chatId/settings" element={<ChatCustomization />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
