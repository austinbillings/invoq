function invoq (definitions) {
    const availableCommands = Object.keys(definitions);

    async function invokeCommand (commandName, args) {
        if (!availableCommands.includes(commandName))
            return;

        const result = await definitions[commandName](args)
        return result
    }

    async function run () {
        const targets = process.argv.slice(2);
        if (targets.every(t => !availableCommands.includes(t)))
            throw new ReferenceError(`No valid command found amongst ${targets.join(', ')}`)
        for (let target of targets) {
            await invokeCommand(target, targets.filter(t => t !== target))
        }
    }

    return run();
}

module.exports = invoq
