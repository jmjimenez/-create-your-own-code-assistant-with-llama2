import { vscode } from "./utilities/vscode";
import "./App.css";
import ConversationView from "./views/conversationView";

function App() {

  return (
    <main>
       <ConversationView />
    </main>
  );
}

export default App;
