function invoq (definitions, givenTargets, loadedFromPath) {
    const availableCommands = Object.keys(definitions);
    const isValidCommand = c => availableCommands.includes(c)

    async function invokeCommand (commandName, args) {
        if (!isValidCommand(commandName)) return;

        const result = await definitions[commandName](args)
        return result
    }

    const defaultTargets = process.argv.slice(2);

    async function run () {
        const targets = givenTargets || defaultTargets;

        if (!targets.some(isValidCommand))
            throw new RangeError(`\n\n${targets[0]} is not a valid command. ${loadedFromPath ? `\nPlease check the commands listed in ${loadedFromPath}` : ''}\n\n`)

        for (let i=0; i<targets.length; i++) {
            let target = targets[i]
            let nextTarget = targets.slice(i+1).findIndex(isValidCommand)
            await invokeCommand(target, targets.slice(i + 1, nextTarget >= 0 ? nextTarget : undefined))
        }
    }

    return run();
}

module.exports = invoq
