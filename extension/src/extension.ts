import { commands, ExtensionContext, chat } from "vscode";
import { KuzcoPanel } from "./panels/KuzcoPanel";
import { KuzcoChat} from "./chat/KuzcoChat";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showChatCommand = commands.registerCommand("kuzco.showChat", () => {
    KuzcoPanel.render(context.extensionUri);
  });

  const kuzcoChatParticipant = chat.createChatParticipants('kuzco.chat', KuzcoChat.initialize);
  // Add command to the extension context
  context.subscriptions.push(kuzcoChatParticipant, showChatCommand);
}
