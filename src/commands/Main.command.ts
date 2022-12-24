import { Color } from "../core/RS";
import { DependencyInjector } from "../core/DependencyInjector";
import { BalloonWindowTransformComponent } from "../components/BalloonWindowTransformComponent";
import ComponentExecutor, { Executuor } from "../core/ComponentExecutor";

/**
 * ? Main
 * @description
 * 메인 엔트리 포인트입니다.
 */
export function getMainCommand(): Executuor {
    return () => {
        /// ======================================================================
        /// DI
        /// ======================================================================
        const alias_Scene_Message_associateWindows__enrtyPoint =
            Scene_Message.prototype.associateWindows;
        Scene_Message.prototype.associateWindows = function () {
            alias_Scene_Message_associateWindows__enrtyPoint.call(this);
            const messageWindow = this._messageWindow;
            DependencyInjector.injectMessageWindow(messageWindow);
            DependencyInjector.ready();

            ComponentExecutor.getInstance().executeLazyCommandAll();
        };

        Scene_Message.prototype.messageWindowRect = function () {
            const ww = Graphics.width;
            const wh = this.calcWindowHeight(4, false) + 8;
            const wx = (Graphics.height - ww) / 2;
            const wy = 0;
            return new Rectangle(wx, wy, ww, wh);
        };

        const alias_Scene_Message_terminate = Scene_Message.prototype.terminate;
        Scene_Message.prototype.terminate = function () {
            alias_Scene_Message_terminate.call(this);
            DependencyInjector.ejectMessageWindow();
        };

        RS.MessageSystem.initSystem();

        // ! [DEBUG]
        if (RS.MessageSystem.Params.DEBUG) {
            SceneManager.showDevTools();
            const win = nw.Window.get();
            win.moveTo(window.outerWidth / 3, 153);
        }
    };
}
