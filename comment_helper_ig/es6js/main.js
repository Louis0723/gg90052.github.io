var errorMessage = false;
window.onerror = handleErr

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	let hidearea = 0;
	$('header').click(function () {
		hidearea++;
		if (hidearea >= 5) {
			$('header').off('click');
			$('#fbid_button, #pure_fbid').removeClass('hide');
		}
	});

	let hash = location.hash;
	if (hash.indexOf("access_token") >= 0) {
		config.access_token = window.location.hash.replace('#', '?')
		fb.start();
	}

	$("#btn_start").click(function () {
		fb.getAuth('addScope');
	});


	$("#btn_choose").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			choose.init(true);
		} else {
			choose.init();
		}
	});

	$("#moreprize").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		} else {
			$(this).addClass("active");
			$(".gettotal").addClass("fadeout");
			$('.prizeDetail').addClass("fadein");
		}
	});

	$("#endTime").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
	});


	$("#btn_addPrize").click(function () {
		$(".prizeDetail").append(`<div class="prize"><div class="input_group">品名：<input type="text"></div><div class="input_group">抽獎人數：<input type="number"></div></div>`);
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || !e.altKey) {
			$("#btn_excel").text("輸出EXCEL");
		}
	});

	$('.tables .total .filters select').change(function () {
		compare.init();
	});

	$('.compare_condition').change(function () {
		$('.tables .total .table_compare').addClass('hide');
		$('.tables .total .table_compare.' + $(this).val()).removeClass('hide');
	});

	$('.rangeDate').daterangepicker({
		"singleDatePicker": true,
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY-MM-DD   HH:mm",
			"separator": "-",
			"applyLabel": "確定",
			"cancelLabel": "取消",
			"fromLabel": "From",
			"toLabel": "To",
			"customRangeLabel": "Custom",
			"daysOfWeek": [
				"日",
				"一",
				"二",
				"三",
				"四",
				"五",
				"六"
			],
			"monthNames": [
				"一月",
				"二月",
				"三月",
				"四月",
				"五月",
				"六月",
				"七月",
				"八月",
				"九月",
				"十月",
				"十一月",
				"十二月"
			],
			"firstDay": 1
		},
	}, function (start, end, label) {
		config.filter.endTime = start.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(nowDate());


	$("#btn_excel").click(function (e) {
		let filterData = data.filter(data.raw);
		if (e.ctrlKey) {
			let dd;
			if (tab.now === 'compare') {
				dd = JSON.stringify(compare[$('.compare_condition').val()]);
			} else {
				dd = JSON.stringify(filterData[tab.now]);
			}
			var url = 'data:text/json;charset=utf8,' + dd;
			window.open(url, '_blank');
			window.focus();
		} else {
			if (filterData.length > 7000) {
				$(".bigExcel").removeClass("hide");
			} else {
				if (tab.now === 'compare') {
					JSONToCSVConvertor(data.excel(compare[$('.compare_condition').val()]), "Comment_helper", true);
				} else {
					JSONToCSVConvertor(data.excel(filterData[tab.now]), "Comment_helper", true);
				}
			}
		}
	});

	$("#genExcel").click(function () {
		var filterData = data.filter(data.raw);
		var excelString = data.excel(filterData)
		$("#exceldata").val(JSON.stringify(excelString));
	});

	let ci_counter = 0;
	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey) {
			fb.getAuth('sharedposts');
		}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

let config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: ['created_time', 'from', 'message', 'story'],
		likes: ['name']
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500',
		likes: '500'
	},
	apiVersion: {
		comments: 'v2.7',
		reactions: 'v2.7',
		sharedposts: 'v2.3',
		url_comments: 'v2.7',
		feed: 'v2.9',
		group: 'v2.9',
		newest: 'v2.8'
	},
	filter: {
		word: '',
		react: 'all',
		endTime: nowDate()
	},
	order: '',
	auth: 'user_photos,user_posts,user_managed_groups,manage_pages',
	extension: false,
	access_token: '',
}

let fb = {
	next: '',
	getAuth: (type) => {
		let url = 'https://api.instagram.com/oauth/authorize/?client_id=b8c49f124d8347d68d5c068b8351622c&redirect_uri=http://localhost:8080&response_type=token&scope=public_content';
		location.href = url;
	},
	start: () => {
		//輸入網址
		// $.get(`https://api.instagram.com/oembed?url=https://www.instagram.com/p/Bgyox8sjnE6/?hl=zh-tw`, function(res){
		// 	console.log(res);
		// })
		step.step1();
		fb.feed();

	},
	feed: () => {
		$.get(`https://api.instagram.com/v1/users/self/media/recent${config.access_token}&count=50`, function (res) {
			console.log(res);
			for (let i of res.data) {
				let message = (i.caption) ? i.caption.text : '';
				let card = `
				<div class="card">
				<img src="${i.images.low_resolution.url}">
				<p class="likes"><span class="fa fa-heart"></span>${i.likes.count}</p>
				<p class="message">${message}</p>
				<button class="btn" onclick="step.step2('${i.id}')">開始</button>
				</div>`;
				$('.step.step1 .feeds').append(card);
			}
		});
	},
}
let step = {
	step1: () => {
		$('.section').removeClass('step2');
		$("html, body").scrollTop(0);
	},
	step2: (mediaid) => {
		$('.recommands, .feeds').empty();
		$('.section').addClass('step2');
		$("html, body").scrollTop(0);
		data.raw.fullID = mediaid;
		data.raw.data = {};
		Promise.all([getComment(), getLikes()]).then(res=>{
			data.finish();
		});

		function getComment() {
			return new Promise((resolve, reject) => {
				$.get(`https://api.instagram.com/v1/media/${mediaid}/comments${config.access_token}`, function (res) {
					let data_arr = [];
					for(let i of res.data){
						let obj = {
							created_time: i.created_time,
							from: i.from,
							id: i.id,
							message: i.text,
						}
						data_arr.push(obj);
					}
					data.raw.data.comments = data_arr;
					resolve();
				})
			});
		}
		function getLikes() {
			return new Promise((resolve, reject) => {
				$.get(`https://api.instagram.com/v1/media/${mediaid}/likes${config.access_token}`, function (res) {
					let data_arr = [];
					for(let i of res.data){
						let obj = {
							from: {
								id: i.id,
								full_name: i.full_name,
								profile_picture: i.profile_picture,
								username: i.username,
							},
							type: 'LOVE',
						}
						data_arr.push(obj);
					}
					data.raw.data.reactions = data_arr;
					resolve();
				})
			});
		}
	}
}

let data = {
	raw: {},
	filtered: {},
	userid: '',
	nowLength: 0,
	extension: false,
	promise_array: [],
	test: (id) => {
		console.log(id);
	},
	init: () => {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('');
		data.nowLength = 0;
		data.promise_array = [];
		data.raw = [];
	},
	start: (fbid) => {
		data.init();
		let obj = {
			fullID: fbid
		}
		$(".waiting").removeClass("hide");
		let commands = ['comments', 'reactions', 'sharedposts'];
		let temp_data = obj;
		for (let i of commands) {
			temp_data.data = {};
			let promise = data.get(temp_data, i).then((res) => {
				temp_data.data[i] = res;
			});
			data.promise_array.push(promise);
		}

		Promise.all(data.promise_array).then(() => {
			data.finish(temp_data);
		});
	},
	get: (fbid, command) => {
		return new Promise((resolve, reject) => {
			let datas = [];
			let promise_array = [];
			let shareError = 0;
			if (fbid.type === 'group') command = 'group';
			if (command === 'sharedposts') {
				getShare();
			} else {
				FB.api(`${config.apiVersion[command]}/${fbid.fullID}/${command}?limit=${config.limit[command]}&order=chronological&access_token=${config.pageToken}&fields=${config.field[command].toString()}`, (res) => {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					for (let d of res.data) {
						if (command == 'reactions') {
							d.from = {
								id: d.id,
								name: d.name
							};
						}
						if (d.from) {
							datas.push(d);
						} else {
							//event
							d.from = {
								id: d.id,
								name: d.id
							};
							if (d.updated_time) {
								d.created_time = d.updated_time;
							}
							datas.push(d);
						}
					}
					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
				});
			}

			function getNext(url, limit = 0) {
				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					for (let d of res.data) {
						if (command == 'reactions') {
							d.from = {
								id: d.id,
								name: d.name
							};
						}
						if (d.from) {
							datas.push(d);
						} else {
							//event
							d.from = {
								id: d.id,
								name: d.id
							};
							if (d.updated_time) {
								d.created_time = d.updated_time;
							}
							datas.push(d);
						}
					}
					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
				}).fail(() => {
					getNext(url, 200);
				});
			}

			function getShare(after = '') {
				let url = `https://am66ahgtp8.execute-api.ap-northeast-1.amazonaws.com/share?fbid=${fbid.fullID}&after=${after}`;
				$.getJSON(url, function (res) {
					if (res === 'end') {
						resolve(datas);
					} else {
						if (res.errorMessage) {
							resolve(datas);
						} else if (res.data) {
							// shareError = 0;
							for (let i of res.data) {
								let name = '';
								if (i.story) {
									name = i.story.substring(0, i.story.indexOf(' shared'));
								} else {
									name = i.id.substring(0, i.id.indexOf("_"));
								}
								let id = i.id.substring(0, i.id.indexOf("_"));
								i.from = {
									id,
									name
								};
								datas.push(i);
							}
							getShare(res.after);
						} else {
							resolve(datas);
						}
					}
				})
			}
		});
	},
	finish: () => {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		$("body").scrollTop(0);
		
		swal('完成！', 'Done!', 'success').done();
		console.log(data.raw)
		// data.raw = fbid;
		data.filter(data.raw, true);
	},
	filter: (rawData, generate = false) => {
		data.filtered = {};
		let isDuplicate = $("#unique").prop("checked");
		for (let key of Object.keys(rawData.data)) {
			let newData = filter.totalFilter(rawData.data[key], key, isDuplicate, false, ...obj2Array(config.filter));
			data.filtered[key] = newData;
		}
		console.log(data.filtered);
		if (generate === true) {
			table.generate(data.filtered);
		} else {
			return data.filtered;
		}
	},
}

let table = {
	generate: (rawdata) => {
		$(".tables table").DataTable().destroy();
		let filtered = rawdata;
		let pic = $("#picture").prop("checked");
		for (let key of Object.keys(filtered)) {
			let thead = '';
			let tbody = '';
			if (key === 'reactions') {
				thead = `<td>序號</td>
				<td>名字</td>
				<td>心情</td>`;
			} else {
				thead = `<td>序號</td>
				<td width="200">名字</td>
				<td class="force-break">留言內容</td>
				<td class="nowrap">留言時間</td>`;
			}
			for (let [j, val] of filtered[key].entries()) {
				let time = val.created_time + '000';
				let td = `<td>${j+1}</td>
				<td><a href='http://www.instagram.com/${val.from.username}' attr-fbid="${val.from.username}" target="_blank">${val.from.full_name}</a></td>`;
				if (key === 'reactions') {
					td += `<td class="center"><span class="react ${val.type || ''}"></span>LIKE</td>`;
				} else{
					td += `<td class="force-break">${val.message}</td>
					<td class="nowrap">${moment(parseInt(time,10)).format('YYYY-MM-DD HH:mm:ss')}</td>`;
				}
				let tr = `<tr>${td}</tr>`;
				tbody += tr;
			}
			let insert = `<thead><tr align="center">${thead}</tr></thead><tbody>${tbody}</tbody>`;
			$(".tables ." + key + " table").html('').append(insert);
		}

		active();
		tab.init();
		compare.init();

		function active() {
			let table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			let arr = ['comments', 'reactions'];
			for (let i of arr) {
				let table = $('.tables .' + i + ' table').DataTable();
				$(".tables ." + i + " .searchName").on('blur change keyup', function () {
					table
						.columns(1)
						.search(this.value)
						.draw();
				});
				$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
					table
						.columns(2)
						.search(this.value)
						.draw();
					config.filter.word = this.value;
				});
			}
		}
	},
	redo: () => {
		data.filter(data.raw, true);
	}
}

let compare = {
	and: [],
	or: [],
	raw: [],
	init: () => {
		compare.and = [];
		compare.or = [];
		compare.raw = data.filter(data.raw);
		let ignore = $('.tables .total .filters select').val();
		let base = [];
		let final = [];
		let compare_num = 1;
		if (ignore === 'ignore') compare_num = 2;

		for (let key of Object.keys(compare.raw)) {
			if (key !== ignore) {
				for (let i of compare.raw[key]) {
					base.push(i);
				}
			}
		}
		base = base.sort((a, b) => {
			return a.from.id > b.from.id ? 1 : -1;
		});

		for (let i of base) {
			i.match = 0;
		}

		let temp = '';
		let temp_name = '';
		// console.log(base);
		for (let i in base) {
			let obj = base[i];
			if (obj.from.id == temp || (data.raw.extension && (obj.from.name == temp_name))) {
				let tar = final[final.length - 1];
				tar.match++;
				for (let key of Object.keys(obj)) {
					if (!tar[key]) tar[key] = obj[key]; //合併資料
				}
				if (tar.match == compare_num) {
					temp_name = '';
					temp = '';
				}
			} else {
				final.push(obj);
				temp = obj.from.id;
				temp_name = obj.from.name;
			}
		}


		compare.or = final;
		compare.and = compare.or.filter((val) => {
			return val.match == compare_num;
		});
		compare.generate();
	},
	generate: () => {
		$(".tables .total table").DataTable().destroy();
		let data_and = compare.and;

		let tbody = '';
		for (let [j, val] of data_and.entries()) {
			let time = val.created_time + '000';
			let td = `<td>${j+1}</td>
			<td><a href='http://www.instagram.com/${val.from.username}' attr-fbid="${val.from.username}" target="_blank">${val.from.full_name}</a></td>
			<td class="center"><span class="react ${val.type || ''}"></span>LIKE</td>
			<td class="force-break">${val.message || ''}</td>
			<td class="nowrap">${moment(parseInt(time,10)).format('YYYY-MM-DD HH:mm:ss')}</td>`;
			let tr = `<tr>${td}</tr>`;
			tbody += tr;
		}
		$(".tables .total .table_compare.and tbody").html('').append(tbody);

		let data_or = compare.or;
		let tbody2 = '';
		for (let [j, val] of data_or.entries()) {
			let time = val.created_time + '000';
			let td = `<td>${j+1}</td>
			<td><a href='http://www.instagram.com/${val.from.username}' attr-fbid="${val.from.username}" target="_blank">${val.from.full_name}</a></td>
			<td class="center"><span class="react ${val.type || ''}"></span>LIKE</td>
			<td class="force-break">${val.message || ''}</td>
			<td class="nowrap">${moment(parseInt(time,10)).format('YYYY-MM-DD HH:mm:ss')}</td>`;
			let tr = `<tr>${td}</tr>`;
			tbody2 += tr;
		}
		$(".tables .total .table_compare.or tbody").html('').append(tbody2);

		active();

		function active() {
			let table = $(".tables .total table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
			let arr = ['and', 'or'];
			for (let i of arr) {
				let table = $('.tables .' + i + ' table').DataTable();
				$(".tables ." + i + " .searchName").on('blur change keyup', function () {
					table
						.columns(1)
						.search(this.value)
						.draw();
				});
				$(".tables ." + i + " .searchComment").on('blur change keyup', function () {
					table
						.columns(2)
						.search(this.value)
						.draw();
					config.filter.word = this.value;
				});
			}
		}
	}
}

let choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: (ctrl = false) => {
		let thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.data = data.filter(data.raw);
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#moreprize").hasClass("active")) {
			choose.detail = true;
			$(".prizeDetail .prize").each(function () {
				var n = parseInt($(this).find("input[type='number']").val());
				var p = $(this).find("input[type='text']").val();
				if (n > 0) {
					choose.num += parseInt(n);
					choose.list.push({
						"name": p,
						"num": n
					});
				}
			});
		} else {
			choose.num = $("#howmany").val();
		}
		choose.go(ctrl);
	},
	go: (ctrl) => {
		let command = tab.now;
		if (tab.now === 'compare') {
			choose.award = genRandomArray(compare[$('.compare_condition').val()].length).splice(0, choose.num);
		} else {
			choose.award = genRandomArray(choose.data[command].length).splice(0, choose.num);
		}
		let insert = '';
		let tempArr = [];
		if (command === 'comments') {
			$('.tables > div.active table').DataTable().column(2).data().each(function (value, index) {
				let word = $('.searchComment').val();
				if (value.indexOf(word) >= 0) tempArr.push(index);
			});
		}
		for (let i of choose.award) {
			let row = (tempArr.length == 0) ? i : tempArr[i];
			let tar = $('.tables > div.active table').DataTable().row(row).node().innerHTML;
			insert += '<tr>' + tar + '</tr>';
		}
		$('#awardList table tbody').html(insert);
		if (!ctrl) {
			$("#awardList tbody tr").each(function () {
				// let tar = $(this).find('td').eq(1);
				// let id = tar.find('a').attr('attr-fbid');
				// tar.prepend(`<img src="http://graph.facebook.com/${id}/picture?type=small"><br>`);
			});
		}

		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			let now = 0;
			for (let k in choose.list) {
				let tar = $("#awardList tbody tr").eq(now);
				$(`<tr><td class="prizeName" colspan="7">獎品： ${choose.list[k].name} <span>共 ${choose.list[k].num} 名</span></td></tr>`).insertBefore(tar);
				now += (choose.list[k].num + 1);
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	}
}

let filter = {
	totalFilter: (raw, command, isDuplicate, isTag, word, react, endTime) => {
		let data = raw;
		if (isDuplicate) {
			data = filter.unique(data);
		}
		if (word !== '' && command == 'comments') {
			data = filter.word(data, word);
		}
		
		// if (command !== 'reactions') {
		// 	data = filter.time(data, endTime);
		// } else {
		// 	data = filter.react(data, react);
		// }

		return data;
	},
	unique: (data) => {
		let output = [];
		let keys = [];
		data.forEach(function (item) {
			let key = item.from.id;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: (data, word) => {
		let newAry = $.grep(data, function (n, i) {
			if (n.message.indexOf(word) > -1) {
				return true;
			}
		});
		return newAry;
	},
	tag: (data) => {
		let newAry = $.grep(data, function (n, i) {
			if (n.message_tags) {
				return true;
			}
		});
		return newAry;
	},
	time: (data, t) => {
		let time_ary = t.split("-");
		let time = moment(new Date(time_ary[0], (parseInt(time_ary[1]) - 1), time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		let newAry = $.grep(data, function (n, i) {
			let created_time = moment(n.created_time)._d;
			if (created_time < time || n.created_time == "") {
				return true;
			}
		});
		return newAry;
	},
	react: (data, tar) => {
		if (tar == 'all') {
			return data;
		} else {
			let newAry = $.grep(data, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
}

let ui = {
	init: () => {

	}
}

let tab = {
	now: "comments",
	init: () => {
		$('#comment_table .tabs .tab').click(function () {
			$('#comment_table .tabs .tab').removeClass('active');
			$(this).addClass('active');
			tab.now = $(this).attr('attr-type');
			let tar = $(this).index();
			$('.tables > div').removeClass('active');
			$('.tables > div').eq(tar).addClass('active');
			if (tab.now === 'compare') {
				compare.init();
			}
		});
	}
}



function nowDate() {
	var a = new Date();
	var year = a.getFullYear();
	var month = a.getMonth() + 1;
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	return year + "-" + month + "-" + date + "-" + hour + "-" + min + "-" + sec;
}

function timeConverter(UNIX_timestamp) {
	var a = moment(UNIX_timestamp)._d;
	var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	if (date < 10) {
		date = "0" + date;
	}
	var hour = a.getHours();
	if (hour < 10) {
		hour = "0" + hour;
	}
	var min = a.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}
	var sec = a.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}
	var time = year + '-' + month + '-' + date + " " + hour + ':' + min + ':' + sec;
	return time;
}

function obj2Array(obj) {
	let array = $.map(obj, function (value, index) {
		return [value];
	});
	return array;
}

function genRandomArray(n) {
	var ary = new Array();
	var i, r, t;
	for (i = 0; i < n; ++i) {
		ary[i] = i;
	}
	for (i = 0; i < n; ++i) {
		r = Math.floor(Math.random() * n);
		t = ary[r];
		ary[r] = ary[i];
		ary[i] = t;
	}
	return ary;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

	var CSV = '';
	//Set Report title in first row or line

	// CSV += ReportTitle + '\r\n\n';

	//This condition will generate the Label/Header
	if (ShowLabel) {
		var row = "";

		//This loop will extract the label from 1st index of on array
		for (var index in arrData[0]) {

			//Now convert each value to string and comma-seprated
			row += index + ',';
		}

		row = row.slice(0, -1);

		//append Label row with line break
		CSV += row + '\r\n';
	}

	//1st loop is to extract each row
	for (var i = 0; i < arrData.length; i++) {
		var row = "";

		//2nd loop will extract each column and convert it in string comma-seprated
		for (var index in arrData[i]) {
			row += '"' + arrData[i][index] + '",';
		}

		row.slice(0, row.length - 1);

		//add a line break after each row
		CSV += row + '\r\n';
	}

	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	//Generate a file name
	var fileName = "";
	//this will remove the blank-spaces from the title and replace it with an underscore
	fileName += ReportTitle.replace(/ /g, "_");

	//Initialize file format you want csv or xls
	var uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV);

	// Now the little tricky part.
	// you can use either>> window.open(uri);
	// but this will not work in some browsers
	// or you will not get the correct file extension    

	//this trick will generate a temp <a /> tag
	var link = document.createElement("a");
	link.href = uri;

	//set the visibility hidden so it will not effect on your web-layout
	link.style = "visibility:hidden";
	link.download = fileName + ".csv";

	//this part will append the anchor tag and remove it after automatic click
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}