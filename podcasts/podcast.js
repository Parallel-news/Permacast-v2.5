/**
 * SWC used as first level data registery for
 * Arweave hosted podcasts.
 * 
 * The current contract represents a basic PoC
 * 
 * contributor(s): charmful0x
 * 
 * Lisence: MIT
**/



export async function handle(state, action) {
	const input = action.input
	const caller = action.caller
	const podcasts = state.podcasts

	const contractID = SmartWeave.contract.id
	const contractTxObject = await SmartWeave.unsafeClient.transactions.get(contractID)
	const base64Owner = contractTxObject["owner"]
	const contractOwner = await SmartWeave.unsafeClient.wallets.ownerToAddress(base64Owner)

	if (input.function === "createPodcast") {
		const name = input.name
		const desc = input.desc
		const cover = input.cover
		const pid = SmartWeave.transaction.id

		const tagsMap = new Map();

		if (caller !== contractOwner ) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (typeof name !== "string" || name.length > 50) {
			throw new ContractError(`uncorrect name limit`)
		}

		if (typeof desc !== "string" || desc.length > 500) {
			throw new ContractError(`description too long`)
		}

		// validate the cover TXID. it should be an Arweave data
		// TX having image/x mime type

		// <------------------------
		if (typeof cover !== "string" || cover.length !== 43) {
			throw new ContractError(`uncorrect cover format`)
		}

		const coverTx = await SmartWeave.unsafeClient.transactions.get(cover)
		const tags = coverTx.get("tags")

		for (let tag of tags) {
			const key = tag.get("name", {decode: true, string: true} )
			const value = tag.get("value", {decode: true, string: true})
			tagsMap.set(key, value)
		}

		if (! tagsMap.has("Content-Type")) {
			throw new ContractError(`uncorrect data transaction`)
		}

		if (! tagsMap.get("Content-Type").startsWith("image/") ) {
			throw new ContractError(`invalid mime type`)
		}

		// ------------------------>

		if ( pid in podcasts ) {
			throw new ContractError(`podcast having ID: ${pid} is already registered`)
		}

		podcasts[podcastID] = {

			"podcastName": name,
			"description": desc,
			"cover": cover,
			"episodes":[],
			"logs": [pid]
		}

		return { state }
	}

	if ( input.function === "addEpisode") {
		const pid = input.pid
		const name = input.name
		const audio = input.audio
		const desc = input.desc

		const tagsMap = new Map()

		if (caller !== contractOwner ) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} not found`)
		}

		if (typeof name !== "string" || name.length > 50) {
			throw new ContractError(`uncorrect name limit`)
		}

		if (typeof desc !== "string" || desc.length > 250) {
			throw new ContractError(`description too long`)
		}

		if (typeof audio !== "string" || audio.length !== 43) {
			throw new ContractError(`invalid audio TX`)
		}

		const audioTx = await SmartWeave.unsafeClient.transactions.get(audio)
		const tags = audioTx.get("tags")

		for (let tag of tags) {
			const key = tag.get("name", {decode: true, string: true} )
			const value = tag.get("value", {decode: true, string: true})
			tagsMap.set(key, value)
		}

		if (! tagsMap.has("Content-Type")) {
			throw new ContractError(`uncorrect data transaction`)
		}

		if (! tagsMap.get("Content-Type").startsWith("audio/") ) {
			throw new ContractError(`invalid mime type`)
		}

		podcasts[podcast]["episodes"].push({
			"eid": SmartWeave.transaction.id,
			"episodeName": name,
			"description": desc,
			"audioTx": audio,
			"uploadedAt": SmartWeave.block.height,
			"logs": [SmartWeave.transaction.id]
		})

		return { state }

	}

	
	// PODCAST ACTIONS:

	if (input.function === "deletePodcast") {
		const pid = input.pid 

		if ( caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (typeof pid !== "string" || pid.length !== 43) {
			throw new ContractError(`invalid pid `)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} does not exist`)
		}

		delete podcasts[pid]

		return { state }
	}

	if (input.function === "editPodcastName") {
		const pid = input.pid 
		const name = input.name
		
		const actionTx = SmartWeave.transaction.id

		if ( caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (typeof pid !== "string" || pid.length !== 43) {
			throw new ContractError(`invalid pid `)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} does not exist`)
		}

		if (typeof name !== "string") {
			throw new ContractError(`invalid name type`)
		}

		if ( name.length < 3 || name.length > 50 ) {
			throw new ContractError(`the name does not meet the name limits`)
		}

		if ( podcasts[pid]["podcastName"] ===  name) {
			throw new ContractError(`old name and new name cannot be equals`)
		}

		podcasts[pid]["podcastName"] = name
		podcasts[pid]["logs"].push(actionTx)

		return { state }
	}

	if (input.function === "editPodcastDesc") {
		const pid = input.pid 
		const desc = input.desc
		
		const actionTx = SmartWeave.transaction.id

		if ( caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (typeof pid !== "string" || pid.length !== 43) {
			throw new ContractError(`invalid pid `)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} does not exist`)
		}

		if ( typeof desc !== "string" ) {
			throw new ContractError(`invalid description type`)
		}

		if ( desc.length > 250 ) {
			throw new ContractError(`description length too high`)
		}

		if ( podcasts[pid]["description"] === desc ) {
			throw new ContractError(`old description and new description cannot be equals`)
		}

		podcasts[pid]["description"] = desc
		podcasts[pid]["logs"].push(actionTx)

		return { state }

	}

	if (input.function === "editPodcastCover") {
		const pid = input.pid 
		const cover = input.cover
		
		const tagsMap = new Map();
		const actionTx = SmartWeave.transaction.id

		if ( caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (typeof pid !== "string" || pid.length !== 43) {
			throw new ContractError(`invalid pid `)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} does not exist`)
		}

		if (typeof cover !== "string" || cover.length !== 43) {
			throw new ContractError(`uncorrect cover format`)
		}

		const coverTx = await SmartWeave.unsafeClient.transactions.get(cover)
		const tags = coverTx.get("tags")

		for (let tag of tags) {
			const key = tag.get("name", {decode: true, string: true} )
			const value = tag.get("value", {decode: true, string: true})
			tagsMap.set(key, value)
		}

		if (! tagsMap.has("Content-Type")) {
			throw new ContractError(`uncorrect data transaction`)
		}

		if (! tagsMap.get("Content-Type").startsWith("image/") ) {
			throw new ContractError(`invalid mime type`)
		}

		if ( podcasts[pid]["cover"] === cover ) {
			throw new ContractError(`old cover and new cover cannot be equals`)
		}

		podcasts[pid]["cover"] = cover
		podcasts[pid]["logs"].push(actionTx)

		return { state }

	}
	
	// EPISODES ACTIONS:

	if (input.function === "editEpisodeName") {
		const name = input.name
		const pid = input.pid
		const id = input.id
		
		const actionTx = SmartWeave.transaction.id

		if (caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} not found`)
		}

		if (! podcasts[pid]["episodes"][id]) {
			throw new ContractError(`episode having index: ${id} not found`)
		}

		if (typeof name !== "string") {
			throw new ContractError(`invalid name format`)
		}

		if (name.length < 2 || name.length > 50) {
			throw new ContractError(`${name} does not meet the name limits`)
		}

		if ( podcasts[pid][id]["episodeName"] === name ) {
			throw new ContractError(`new name and old name cannot be the same`)
		}

		podcasts[pid]["episodes"][id]["episodeName"] = name
		podcasts[pid]["episodes"][id]["logs"].push(actionTx)

		return { state }
	}

	if (input.function === "editEpisodeDesc") {
		const pid = input.pid
		const id = input.id
		const desc = input.desc
		
		const actionTx = SmartWeave.transaction.id

		if (caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} not found`)
		}

		if (! podcasts[pid]["episodes"][id]) {
			throw new ContractError(`episode having index: ${id} not found`)
		}

		if (typeof desc !== "string") {
			throw new ContractError(`invalid description format`)
		}

		if ( desc.length < 25 || desc.length > 500 ) {
			throw new ContractError(`the description text does not meet the desc limits`)
		}

		if ( podcasts[pid]["episodes"][id]["description"] === desc) {
			throw new ContractError(`old description and new description canot be the same`)
		}

		podcasts[pid]["episodes"][id]["description"] = desc
		podcasts[pid]["episodes"][id]["logs"].push(actionTx)

		return { state }
	}

	if (input.function === "deleteEpisode") {
		const pid = input.pid
		const id = input.id

		if ( caller !== contractOwner) {
			throw new ContractError(`invalid caller. Only ${contractOwner} can perform this action`)
		}

		if (! podcasts[pid]) {
			throw new ContractError(`podcast having ID: ${pid} not found`)
		}

		if (! podcasts[pid][id]) {
			throw new ContractError(`episode having index: ${id} not found`)
		}

		podcasts[pid]["episodes"].splice(id, 1)

		return { state }
	}

	throw new ContractError(`unknow function supplied: '${input.function}'`)

}

