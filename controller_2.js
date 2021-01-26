'use strict'

let P1, P2, C
let L1, L2, L3, L3A
let G1, G2, G3
let Bezier

function initSVG(e) {
	const svg = e.target
	const box = svg.getBBox()

	const pSize = 10
	const pAttrs = {
		cy: box.y + box.height * 0.8,
		r: pSize,
		fill: 'green',
		class: 'draggable',
	}
	P1 = document.getElementById('P1')
	setAttributes(P1, {
		cx: box.x + box.width * 0.1,
		...pAttrs,
	})
	P2 = document.getElementById('P2')
	setAttributes(P2, {
		cx: box.x + box.width * 0.9,
		...pAttrs,
	})

	const cSize = 15
	const cAttrs = {
		y: box.y + box.height * 0.2 - cSize / 2,
		width: cSize,
		height: cSize,
		fill: 'green',
		class: 'draggable',
	}
	C = document.getElementById('C1')
	setAttributes(C, {
		x: box.x + box.width * 0.5 - cSize / 2,
		...cAttrs,
	})

	const lAttrs = {
		stroke: 'blue',
		'stroke-width': 1,
	}
	L1 = document.getElementById('L1')
	setAttributes(L1, lAttrs)
	L2 = document.getElementById('L2')
	setAttributes(L2, lAttrs)

	Bezier = document.getElementById('Bezier')
	setAttributes(Bezier, {
		stroke: 'black',
		'stroke-width': '3',
		fill: 'none',
	})

	G1 = document.getElementById('G1')
	G2 = document.getElementById('G2')
	G3 = document.getElementById('G3')

	const lgAttrs = {
		stroke: 'coral',
		'stroke-width': 1.5,
	}
	L3 = document.getElementById('L3')
	setAttributes(L3, lgAttrs)
	L3A = document.getElementById('L3A')

	updatePath()
	setEventHandler(e)
}

function updatePath() {
	const bP1 = P1.getBBox()
	const bP2 = P2.getBBox()
	const bC = C.getBBox()
	function getX(bBox) {
		return bBox.x + bBox.width / 2
	}
	function getY(bBox) {
		return bBox.y + bBox.height / 2
	}
	function trans(bBox) {
		return `${getX(bBox)},${getY(bBox)}`
	}
	L1.setAttribute('d', `M${trans(bP1)}L${trans(bC)}`)
	L2.setAttribute('d', `M${trans(bC)}L${trans(bP2)}`)

	L3.setAttribute('d', `M${trans(bP1)}L${trans(bC)}`)
	L3A.setAttribute(
		'values',
		`M${trans(bP1)}L${trans(bC)};M${trans(bC)}L${trans(bP2)}`
	)

	Bezier.setAttribute('d', `M${trans(bP1)}Q${trans(bC)},${trans(bP2)}`)
}

function setEventHandler(e) {
	const svg = e.target
	svg.addEventListener('mousedown', startDrag)
	svg.addEventListener('mousemove', drag)
	svg.addEventListener('mouseup', endDrag)
	svg.addEventListener('mouseleave', endDrag)

	let selectedElement = null
	let offset = { x: 0, y: 0 }

	function startDrag(e) {
		if (e.target.classList.contains('draggable')) {
			selectedElement = e.target
			offset = getPosition(e)
			const x = selectedElement.tagName === 'circle' ? 'cx' : 'x'
			const y = selectedElement.tagName === 'circle' ? 'cy' : 'y'
			offset.x -= parseFloat(selectedElement.getAttribute(x))
			offset.y -= parseFloat(selectedElement.getAttribute(y))
		}
	}
	function drag(e) {
		if (selectedElement) {
			e.preventDefault()
			const pos = getPosition(e)
			const x = selectedElement.tagName === 'circle' ? 'cx' : 'x'
			const y = selectedElement.tagName === 'circle' ? 'cy' : 'y'
			selectedElement.setAttribute(x, pos.x - offset.x)
			selectedElement.setAttribute(y, pos.y - offset.y)
			updatePath()
		}
	}
	function endDrag(e) {
		selectedElement = null
	}

	function getPosition(e) {
		const ctm = svg.getScreenCTM()
		return {
			x: (e.clientX - ctm.e) / ctm.a,
			y: (e.clientY - ctm.f) / ctm.d,
		}
	}
}

function createSVGElement(tag, attrs) {
	const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
	return setAttributes(el, attrs)
}

function setAttributes(el, attrs) {
	for (let key in attrs) {
		el.setAttribute(key, attrs[key])
	}
	return el
}
