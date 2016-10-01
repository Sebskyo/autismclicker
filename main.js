/*
                                                 ,  ,
                                               / \/ \
                                              (/ //_ \_
     .-._                                      \||  .  \
      \  '-._                            _,:__.-"/---\_ \
 ______/___  '.    .--------------------'~-'--.)__( , )\ \
`'--.___  _\  /    |                         ,'    \)|\ `\|
     /_.-' _\ \ _:,_             AUTISM            " ||   (
   .'__ _.' \'-/,`-~`            CLICKER             |/
       '. ___.> /=,|                                 |
        / .-'/_ )  '---------------------------------'
        )'  ( /(/
             \\ "
              '=='
*/

/*=======*/
/* DATA  */
/*=======*/

let info_mode = 0
let save_counter = 0
let ctr
const autists = { // currency
	amount: 0,
	aps: 0,
	dom: null,
	ui: {
		x: null,
		y: null,
		w: 128,
		h: 128,
		popup: {
			x: null,
			y: null,
			w: 64,
			h: 64
		}
	}
}
const items = [ // shop items
	{
		name: "Video Games",
		flavour: "owned",
		desc: "The most essential ingredient in any autist.",
		amount: 0,
		price: 100,
		price_mod: 10,
		aps: 1,
		dom: null
	},
	{
		name: "Anime",
		flavour: "watched",
		desc: "No matter what you watch, your taste will always be shit.",
		amount: 0,
		price: 1000,
		price_mod: 15,
		aps: 3,
		dom: null
	},
	{
		name: "Ubuntu Setups",
		flavour: "installed",
		desc: "The road to gentoo is a long one, you gotta start somewhere.",
		amount: 0,
		price: 5000,
		price_mod: 25,
		aps: 10,
		dom: null
	},
	{
		name: "Scriptkiddie Hacks",
		flavour: "run",
		desc: "You think you're hacking, but you're not.",
		amount: 0,
		price: 15000,
		price_mod: 50,
		aps: 35,
		dom: null
	},
	{
		name: "Shitposts",
		flavour: "made",
		desc: "You'll create memes soon enough, be patient, practice leads to mastery.",
		amount: 0,
		price: 50000,
		price_mod: 100,
		aps: 80,
		dom: null
	}
]
const upgrades = [ // item upgrades
	{
		
	},
	{
		
	}
] // TODO: make these

/*=======*/
/*  UI   */
/*=======*/

/* DOM interaction */
// render information
function render() {
	let abox = document.getElementById("autist-box")
	let ibox = document.getElementById("item-box")
	
	abox.innerHTML = fstr(
		"\
		Autists<hr>\
		You have %0 autists<br>\
		You are generating %1 autists per second\
		",
		[autists.amount, autists.aps]
	)
	if (info_mode) {
		let item = items.filter(i => i.name == info_mode)[0]
		ibox.className = "action-box"
		ibox.innerHTML = fstr(
			"\
			%0<hr>\
			%1<hr>\
			%2 %3<br>\
			Another one is %4\
			",
			[item.name, item.desc, item.amount, item.flavour, item.price]
		)
	}
	else {
		ibox.className = "action-box hidden"
	}
}

// click animation
function click_anim() {
	let d = document.createElement("div")
	let {x, y} = cal_dom_pos(autists.ui.popup)
	let {w, h} = autists.ui.popup
	d.className = "popup"
	d.style.top = itc(y)
	d.style.left = itc(x)
	d.innerHTML = "<img src='autist.png' alt='autist'></img>"
	document.body.appendChild(d)
	setTimeout(() => {
		d.style.top = itc(y-1.5*h)
		d.style.opacity = "0.0"
	}, 10)
	setTimeout(() => {
		document.body.removeChild(d)
	}, 2000)
}

// makes dom element for an item
function mk_item_dom(data) {
	let {name, x, y} = data
	let d = document.createElement("div")
	d.className = "item"
	let dom_pos = cal_dom_pos({x: data.x, y: data.y, w: 64, h: 64})
	d.style.top = itc(dom_pos.y)
	d.style.left = itc(dom_pos.x)
	d.innerHTML = fstr("<img src='%0' alt='%1'></img>",
						[
						   data.name.toLowerCase().replace(" ", "_")+".png",
						   data.name
					   	])
	d.onmouseover = () => {
		info_mode = name
		render()
	}
	d.onmouseleave = () => {
		info_mode = 0
		render()
	}
	d.onclick = () => {
		buy(name)
		render()
	}
	return d
}

// builds the item circle
function build_circle() {
	info_mode = 0
	let a = items.filter(i => i.amount > 0)
	if (a.length < items.length)
		a.push(items[a.length])
	
	let tmp = cal_circle(ctr, a.length)
	for (let i = 0; i < tmp.length; i++) {
		let d = mk_item_dom({name: a[i].name, x: tmp[i].x, y: tmp[i].y})
		if (a[i].dom) document.body.removeChild(a[i].dom)
		a[i].dom = d
		document.body.appendChild(d)
	}
}

/* UI utilities */
// gets center of window
function get_center() {
	return {x: window.innerWidth/2, y: window.innerHeight/2}
}

// calculates n positions equally spaced in a circle with center c
function cal_circle(c, n) {
	if (n < 1) return undefined
	let r = 256+128 // as if I want to calculate this myself
	let d = (2*Math.PI)/n
	let a = []
	for (let i = 0; i < n; i++) {
		let x, y
		x = c.x-(Math.cos(d*i+(Math.PI/2))*r)
		y = c.y-(Math.sin(d*i+(Math.PI/2))*r)
		a.push({x:x,y:y})
	}
	return a
}

// calculate the (x,y) that DOM should use
function cal_dom_pos(data) {
	let {x, y, w, h} = data
	//console.log(fstr("Calculated (%0,%1) from", [x-w/2, y-h/2]), data)
	return {x: x-w/2, y: y-h/2}
}

// js/css value conversion
function itc(val) {
	return val+"px"
}
function cti(val) {
	return parseInt(val.slice(0, -2), 10)
}

/*=======*/
/* LOGIC */
/*=======*/

/* game logic */
// update logic values (a tick)
function update() {
	autists.aps = 0
	items.forEach(i => autists.aps += i.aps*i.amount)
	autists.amount += autists.aps
	
	if (++save_counter >= 10) {
		save()
		save_counter = 0
	}
}

// buy an item
function buy(item) {
	item = items.filter(i => i.name == item)[0]
	if (autists.amount >= item.price) {
		autists.amount -= item.price
		item.amount++
		item.price += item.amount*item.price_mod
		if (item.amount === 1) build_circle()
	}
}

// basic click
function click() {
	autists.amount++
}

/* saving */
// save game
function save() {
	let data = {}
	data.autists = autists.amount
	data.items = items.map(i =>
						   ({amount: i.amount, price: i.price, aps: i.aps}))
	localStorage.autism_clicker_data = JSON.stringify(data)
	snd_msg("Game Saved " + new Date().getTime())
}

// load game
function load() {
	let data = localStorage.autism_clicker_data
	console.log(data)
	if (data === undefined)
		return false
	data = JSON.parse(data)
	
	autists.amount = data.autists
	for (let i = 0; i < data.items.length; i++) {
		items[i].amount = data.items[i].amount
		items[i].price = data.items[i].price
		items[i].aps = data.items[i].aps
	}
}

// reset game
function reset() {
	localStorage.clear()
	location.reload()
}

/*=======*/
/* UTIL  */
/*=======*/

// string formatting
function fstr(str, arr) {
	str = str.replace(/%%/g, "%")
	arr.forEach((x, i) => {
		let rgx = new RegExp("%"+i, "g")
		str = str.replace(rgx, x)
	})
	return str
}

/*=======*/
/* DEBUG */
/*=======*/

function toggledb() {
	let e = document.getElementById("debug-box")
	e.className = e.className === "action-box hidden" ?
								  "action-box" : "action-box hidden"
}

function snd_msg(msg) {
	document.getElementById("debug-msg").innerHTML = msg
}

document.onmousemove = function(e) {
	let dbb = document.getElementById("debug-mouse")
	dbb.innerHTML = "("+e.pageX+","+e.pageY+")"
}

/*=======*/
/* INIT  */
/*=======*/

window.onload = function() {
	// setting ctr
	ctr = get_center()
	
	// loading data
	load()
	
	// autists (& popup) ui
	autists.ui.x = ctr.x
	autists.ui.y = ctr.y
	autists.ui.popup.x = ctr.x
	autists.ui.popup.y = ctr.y-(autists.ui.h/2+autists.ui.popup.h)
	document.getElementById("debug-center-list")
	.innerHTML = fstr(
		"centers:<br>\
		s:(%0,%1)|m:(%2,%3)|p:(%4,%5)<br>\
		dom positions:<br>\
		m:(%6,%7)|p:(%8,%9)",
		[
			ctr.x, ctr.y,
			autists.ui.x, autists.ui.y,
			autists.ui.popup.x, autists.ui.popup.y,
			cal_dom_pos(autists.ui).x, cal_dom_pos(autists.ui).y,
			cal_dom_pos(autists.ui.popup).x, cal_dom_pos(autists.ui.popup).y
		])
	
	// autists dom setup
	autists.dom = document.createElement("div")
	autists.dom.className = "autist"
	let dom_pos = cal_dom_pos(autists.ui)
	autists.dom.style.top = itc(dom_pos.y)
	autists.dom.style.left = itc(dom_pos.x)
	autists.dom.onclick = () => {
		click_anim()
		click()
		render()
	}
	autists.dom.innerHTML = "<img src='autist.png'></img>"
	document.body.appendChild(autists.dom)
	
	// items
	build_circle()
	
	// pi
	let pi = document.getElementById("pi")
	pi.style.top = itc(ctr.y*2-24)
	pi.style.left = itc(ctr.x*2-24)
	pi.onclick = toggledb
	
	// automatically enable debug TODO: delet this
	// also other debugging stuff below
	toggledb()
	
	render()
	// interval
	setInterval(() => {
		update()
		render()
	}, 1000)
}
