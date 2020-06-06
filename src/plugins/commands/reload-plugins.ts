import { ActionType, RunePlugin } from '@server/plugins/plugin';
import { commandAction } from '@server/world/actor/player/action/input-command-action';
import { injectPlugins } from '@server/game-server';

const action: commandAction = (details) => {
    const { player } = details;

    player.sendLogMessage('Reloading plugins...', details.isConsole);

    // Delete node cache for all the old JS plugins
    for(const path in require.cache) {
        if(!path.endsWith('.js')) {
            continue;
        }
        if(path.indexOf('node_modules') !== -1 || path.indexOf('dist') !== -1) {
            continue;
        }
        if(path.indexOf('rune.js') !== -1 || path.indexOf('plugins') === -1) {
            continue;
        }

        delete require.cache[path];
    }

    injectPlugins()
        .then(() => player.sendLogMessage('Plugins reloaded.', details.isConsole))
        .catch(() => player.sendLogMessage('Error reloading plugins.', details.isConsole));
};

export default new RunePlugin({ type: ActionType.COMMAND, commands: 'plugins', action });
