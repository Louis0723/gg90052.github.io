'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var errorMessage = false;
var fberror = '';
window.onerror = handleErr;
var TABLE;
var lastCommand = 'comments';
var addLink = false;
var auth_scope = '';

function handleErr(msg, url, l) {
	if (!errorMessage) {
		var _url = $('#enterURL .url').val();
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		console.log("Error occur URL： " + _url);
		$(".console .error").append('<br><br>' + fberror + '<br><br>' + _url);
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}
$(document).ready(function () {
	var hash = location.search;
	if (hash.indexOf("extension") >= 0) {
		$(".loading.checkAuth").removeClass("hide");
		data.extension = true;

		$(".loading.checkAuth button").click(function (e) {
			fb.extensionAuth();
		});
	}
	if (hash.indexOf("ranker") >= 0) {
		var datas = {
			command: 'ranker',
			data: JSON.parse(localStorage.ranker)
		};
		data.raw = datas;
		data.finish(data.raw);
	}

	$("#btn_page_selector").click(function (e) {
		fb.getAuth('page_selector');
	});

	$("#btn_comments").click(function (e) {
		console.log(e);
		if (e.ctrlKey || e.altKey) {
			config.order = 'chronological';
		}
		fb.getAuth('comments');
	});

	$("#btn_like").click(function (e) {
		if (e.ctrlKey || e.altKey) {
			config.likes = true;
		}
		fb.getAuth('reactions');
	});
	$("#btn_url").click(function () {
		fb.getAuth('url_comments');
	});
	$("#btn_pay").click(function () {
		fb.getAuth('addScope');
	});
	$("#btn_choose").click(function () {
		choose.init();
	});
	$("#morepost").click(function () {
		ui.addLink();
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
		$(".prizeDetail").append('<div class="prize"><div class="input_group">\u54C1\u540D\uFF1A<input type="text"></div><div class="input_group">\u62BD\u734E\u4EBA\u6578\uFF1A<input type="number"></div></div>');
	});

	$(window).keydown(function (e) {
		if (e.ctrlKey || e.altKey) {
			$("#btn_excel").text("輸出JSON");
		}
	});
	$(window).keyup(function (e) {
		if (!e.ctrlKey || e.altKey) {
			$("#btn_excel").text("複製表格內容");
		}
	});

	$("#unique, #tag").on('change', function () {
		table.redo();
	});

	$(".uipanel .react").change(function () {
		config.filter.react = $(this).val();
		table.redo();
	});

	$('.rangeDate').daterangepicker({
		"timePicker": true,
		"timePicker24Hour": true,
		"locale": {
			"format": "YYYY/MM/DD HH:mm",
			"separator": "-",
			"applyLabel": "確定",
			"cancelLabel": "取消",
			"fromLabel": "From",
			"toLabel": "To",
			"customRangeLabel": "Custom",
			"daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
			"monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			"firstDay": 1
		}
	}, function (start, end, label) {
		config.filter.startTime = start.format('YYYY-MM-DD-HH-mm-ss');
		config.filter.endTime = end.format('YYYY-MM-DD-HH-mm-ss');
		table.redo();
	});
	$('.rangeDate').data('daterangepicker').setStartDate(config.filter.startTime);

	$("#btn_excel").click(function (e) {
		var filterData = data.filter(data.raw);
		if (e.ctrlKey || e.altKey) {
			exportToJsonFile(filterData);
		} else {
			// if (filterData.length > 7000) {
			// 	$(".bigExcel").removeClass("hide");
			// } else {
			// 	JSONToCSVConvertor(data.excel(filterData), "Comment_helper", true);
			// }
		}
	});

	$("#genExcel").click(function () {
		var filterData = data.filter(data.raw);
		var excelString = data.excel(filterData);
		$("#exceldata").val(JSON.stringify(excelString));
	});

	var ci_counter = 0;
	$(".ci").click(function (e) {
		ci_counter++;
		if (ci_counter >= 5) {
			$(".source .url, .source .btn").addClass("hide");
			$("#inputJSON").removeClass("hide");
		}
		if (e.ctrlKey || e.altKey) {}
	});
	$("#inputJSON").change(function () {
		$(".waiting").removeClass("hide");
		$(".console .message").text('截取完成，產生表格中....筆數較多時會需要花較多時間，請稍候');
		data.import(this.files[0]);
	});
});

function exportToJsonFile(jsonData) {
	var dataStr = JSON.stringify(jsonData);
	var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

	var exportFileDefaultName = 'data.json';

	var linkElement = document.createElement('a');
	linkElement.setAttribute('href', dataUri);
	linkElement.setAttribute('download', exportFileDefaultName);
	linkElement.click();
}

function shareBTN() {
	alert('認真看完跳出來的那頁上面寫了什麼\n\n看完你就會知道你為什麼不能抓分享');
}

var config = {
	field: {
		comments: ['like_count', 'message_tags', 'message', 'from', 'created_time'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: ['created_time', 'from', 'message', 'story'],
		likes: ['name']
	},
	limit: {
		comments: '15',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500',
		likes: '500'
	},
	apiVersion: {
		comments: 'v6.0',
		reactions: 'v6.0',
		sharedposts: 'v6.0',
		url_comments: 'v6.0',
		feed: 'v6.0',
		group: 'v6.0',
		newest: 'v6.0'
	},
	filter: {
		word: '',
		react: 'all',
		startTime: '2000-12-31-00-00-00',
		endTime: nowDate()
	},
	order: 'chronological',
	auth: 'manage_pages,groups_access_member_info',
	likes: false,
	pageToken: '',
	from_extension: false
};

var fb = {
	user_posts: false,
	getAuth: function getAuth() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		if (type === '') {
			addLink = true;
			type = lastCommand;
		} else {
			addLink = false;
			lastCommand = type;
		}
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			auth_type: 'rerequest',
			scope: config.auth,
			return_scopes: true
		});
	},
	callback: function callback(response, type) {
		// console.log(response);
		if (response.status === 'connected') {
			auth_scope = response.authResponse.grantedScopes;
			config.from_extension = false;
			if (type == "addScope") {
				if (auth_scope.includes('groups_access_member_info')) {
					swal('付費授權完成，請再次執行抓留言', 'Authorization Finished! Please getComments again.', 'success').done();
				} else {
					swal('付費授權檢查錯誤，該功能需付費', 'Authorization Failed! It is a paid feature.', 'error').done();
				}
			} else if (type == "page_selector") {
				page_selector.show();
			} else {
				fb.user_posts = true;
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response);
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	extensionAuth: function extensionAuth() {
		FB.login(function (response) {
			fb.extensionCallback(response);
		}, {
			scope: config.auth,
			return_scopes: true
		});
	},
	extensionCallback: function extensionCallback(response) {
		if (response.status === 'connected') {
			config.from_extension = true;
			auth_scope = response.authResponse.grantedScopes;
			if (auth_scope.indexOf("groups_access_member_info") < 0) {
				swal({
					title: '抓分享需付費，詳情請見粉絲專頁',
					html: '<a href="https://www.facebook.com/commenthelper/" target="_blank">https://www.facebook.com/commenthelper/</a>',
					type: 'warning'
				}).done();
			} else {
				fb.authOK();
			}
		} else {
			FB.login(function (response) {
				fb.extensionCallback(response);
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	authOK: function authOK() {
		$(".loading.checkAuth").addClass("hide");
		var postdata = JSON.parse(localStorage.postdata);
		var datas = {
			command: postdata.command,
			data: JSON.parse($(".chrome").val())
		};
		data.raw = datas;
		data.finish(data.raw);
	}
};

var data = {
	raw: [],
	userid: '',
	nowLength: 0,
	extension: false,
	init: function init() {
		$(".main_table").DataTable().destroy();
		$("#awardList").hide();
		$(".console .message").text('截取資料中...');
		data.nowLength = 0;
		if (!addLink) {
			data.raw = [];
		}
	},
	start: function start(fbid) {
		$(".waiting").removeClass("hide");
		$('.pure_fbid').text(fbid.fullID);
		data.get(fbid).then(function (res) {
			// fbid.data = res;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var i = _step.value;

					fbid.data.push(i);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			data.finish(fbid);
		});
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = fbid.command;
			if (fbid.type === 'group') {
				fbid.fullID = fbid.pureID;
				command = 'group';
			}
			if (fbid.type === 'group' && fbid.command == 'reactions') {
				fbid.fullID = fbid.pureID;
				fbid.command = 'likes';
			}
			if (config.likes) fbid.command = 'likes';
			console.log(config.apiVersion[command] + '/' + fbid.fullID + '/' + fbid.command + '?limit=' + config.limit[fbid.command] + '&fields=' + config.field[fbid.command].toString() + '&debug=all');
			var token = config.pageToken == '' ? '' : '&access_token=' + config.pageToken;
			FB.api(config.apiVersion[command] + '/' + fbid.fullID + '/' + fbid.command + '?limit=' + config.limit[fbid.command] + '&order=' + config.order + '&fields=' + config.field[fbid.command].toString() + token + '&debug=all', function (res) {
				data.nowLength += res.data.length;
				$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = res.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var d = _step2.value;

						if (fbid.command == 'reactions' || fbid.command == 'likes' || config.likes) {
							d.from = {
								id: d.id,
								name: d.name
							};
						}
						if (config.likes) d.type = "LIKE";
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
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				if (res.data.length > 0 && res.paging.next) {
					getNext(res.paging.next);
				} else {
					resolve(datas);
				}
			});

			function getNext(url) {
				var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				if (limit !== 0) {
					url = url.replace('limit=500', 'limit=' + limit);
				}
				$.getJSON(url, function (res) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = res.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var d = _step3.value;

							if (d.id) {
								if (fbid.command == 'reactions' || fbid.command == 'likes' || config.likes) {
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
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					if (res.data.length > 0 && res.paging.next) {
						// if (data.nowLength < 180) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
				}).fail(function () {
					getNext(url, 200);
				});
			}
		});
	},
	finish: function finish(fbid) {
		$(".waiting").addClass("hide");
		$(".main_table").removeClass("hide");
		$(".update_area,.donate_area").slideUp();
		$(".result_area").slideDown();
		if (data.raw.type == 'group') {
			if (auth_scope.includes('groups_access_member_info')) {
				swal('完成！', 'Done!', 'success').done();
				data.raw = fbid;
				data.filter(data.raw, true);
				ui.reset();
			} else {
				swal('付費授權檢查錯誤，抓社團貼文需付費', 'Authorization Failed! It is a paid feature.', 'error').done();
			}
		} else {
			swal('完成！', 'Done!', 'success').done();
			data.raw = fbid;
			data.filter(data.raw, true);
			ui.reset();
		}
	},
	filter: function filter(rawData) {
		var generate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		var isDuplicate = $("#unique").prop("checked");
		var isTag = $("#tag").prop("checked");
		// if (config.from_extension === false && rawData.command === 'comments') {
		// 	rawData.data = rawData.data.filter(item => {
		// 		return item.is_hidden === false
		// 	});
		// }
		var newData = _filter.totalFilter.apply(_filter, [rawData, isDuplicate, isTag].concat(_toConsumableArray(obj2Array(config.filter))));
		rawData.filtered = newData;
		if (generate === true) {
			table.generate(rawData);
		} else {
			return rawData;
		}
	},
	excel: function excel(raw) {
		var newObj = [];
		console.log(raw);
		if (data.extension) {
			if (raw.command == 'comments') {
				$.each(raw.filtered, function (i) {
					var tmp = {
						"序號": i + 1,
						"臉書連結": 'https://www.facebook.com/' + this.from.id,
						"姓名": this.from.name,
						"留言連結": 'https://www.facebook.com/' + this.postlink,
						"留言內容": this.message
					};
					newObj.push(tmp);
				});
			} else {
				$.each(raw.filtered, function (i) {
					var tmp = {
						"序號": i + 1,
						"臉書連結": 'https://www.facebook.com/' + this.from.id,
						"姓名": this.from.name,
						"分享連結": this.postlink,
						"留言內容": this.story
					};
					newObj.push(tmp);
				});
			}
		} else {
			$.each(raw.filtered, function (i) {
				var tmp = {
					"序號": i + 1,
					"臉書連結": 'https://www.facebook.com/' + this.from.id,
					"姓名": this.from.name,
					"表情": this.type || '',
					"留言內容": this.message || this.story,
					"留言時間": timeConverter(this.created_time)
				};
				newObj.push(tmp);
			});
		}
		return newObj;
	},
	import: function _import(file) {
		var reader = new FileReader();

		reader.onload = function (event) {
			var str = event.target.result;
			data.raw = JSON.parse(str);
			data.finish(data.raw);
		};

		reader.readAsText(file);
	}
};

var table = {
	generate: function generate(rawdata) {
		$(".main_table").DataTable().destroy();
		var filterdata = rawdata.filtered;
		var thead = '';
		var tbody = '';
		var pic = $("#picture").prop("checked");
		if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
			thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u8868\u60C5</td>';
		} else if (rawdata.command === 'sharedposts') {
			thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td class="force-break">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td width="110">\u7559\u8A00\u6642\u9593</td>';
		} else if (rawdata.command === 'ranker') {
			thead = '<td>\u6392\u540D</td>\n\t\t\t<td>\u540D\u5B57</td>\n\t\t\t<td>\u5206\u6578</td>';
		} else {
			thead = '<td>\u5E8F\u865F</td>\n\t\t\t<td width="200">\u540D\u5B57</td>\n\t\t\t<td class="force-break">\u7559\u8A00\u5167\u5BB9</td>\n\t\t\t<td>\u8B9A</td>\n\t\t\t<td class="nowrap">\u7559\u8A00\u6642\u9593</td>';
		}

		var host = 'https://www.facebook.com/';
		if (data.raw.type === 'url_comments') host = $('#enterURL .url').val() + '?fb_comment_id=';

		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = filterdata.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var _step4$value = _slicedToArray(_step4.value, 2),
				    j = _step4$value[0],
				    val = _step4$value[1];

				var picture = '';
				if (pic) {
					picture = '<img src="https://graph.facebook.com/' + val.from.id + '/picture?type=small"><br>';
				}
				var td = '<td>' + (j + 1) + '</td>\n\t\t\t<td><a href=\'https://www.facebook.com/' + val.from.id + '\' target="_blank">' + picture + val.from.name + '</a></td>';
				if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
					td += '<td class="center"><span class="react ' + val.type + '"></span>' + val.type + '</td>';
				} else if (rawdata.command === 'sharedposts') {
					td += '<td class="force-break"><a href="https://www.facebook.com/' + val.id + '" target="_blank">' + val.story + '</a></td>\n\t\t\t\t<td class="nowrap">' + timeConverter(val.created_time) + '</td>';
				} else if (rawdata.command === 'ranker') {
					td = '<td>' + (j + 1) + '</td>\n\t\t\t\t\t  <td><a href=\'https://www.facebook.com/' + val.from.id + '\' target="_blank">' + val.from.name + '</a></td>\n\t\t\t\t\t  <td>' + val.score + '</td>';
				} else {
					var link = val.id;
					if (config.from_extension) {
						link = val.postlink;
					}
					td += '<td class="force-break"><a href="' + host + link + '" target="_blank">' + val.message + '</a></td>\n\t\t\t\t<td>' + val.like_count + '</td>\n\t\t\t\t<td class="nowrap">' + timeConverter(val.created_time) + '</td>';
				}
				var tr = '<tr>' + td + '</tr>';
				tbody += tr;
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}

		var insert = '<thead><tr align="center">' + thead + '</tr></thead><tbody>' + tbody + '</tbody>';
		$(".main_table").html('').append(insert);

		active();

		function active() {
			TABLE = $(".main_table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});

			$("#searchName").on('blur change keyup', function () {
				TABLE.columns(1).search(this.value).draw();
			});
			$("#searchComment").on('blur change keyup', function () {
				TABLE.columns(2).search(this.value).draw();
				config.filter.word = this.value;
			});
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};

var choose = {
	data: [],
	award: [],
	num: 0,
	detail: false,
	list: [],
	init: function init() {
		var thead = $('.main_table thead').html();
		$('#awardList table thead').html(thead);
		$('#awardList table tbody').html('');
		choose.data = data.filter(data.raw);
		choose.award = [];
		choose.list = [];
		choose.num = 0;
		if ($("#searchComment").val() != '') {
			table.redo();
		}
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
		choose.go();
	},
	go: function go() {
		choose.award = genRandomArray(choose.data.filtered.length).splice(0, choose.num);
		var insert = '';
		choose.award.map(function (val, index) {
			insert += '<tr title="第' + (index + 1) + '名">' + $('.main_table').DataTable().rows({
				search: 'applied'
			}).nodes()[val].innerHTML + '</tr>';
		});
		$('#awardList table tbody').html(insert);
		$('#awardList table tbody tr').addClass('success');

		if (choose.detail) {
			var now = 0;
			for (var k in choose.list) {
				var tar = $("#awardList tbody tr").eq(now);
				$('<tr><td class="prizeName" colspan="5">\u734E\u54C1\uFF1A ' + choose.list[k].name + ' <span>\u5171 ' + choose.list[k].num + ' \u540D</span></td></tr>').insertBefore(tar);
				now += choose.list[k].num + 1;
			}
			$("#moreprize").removeClass("active");
			$(".gettotal").removeClass("fadeout");
			$('.prizeDetail').removeClass("fadein");
		}
		$("#awardList").fadeIn(1000);
	},
	gen_big_award: function gen_big_award() {
		var li = '';
		var awards = [];
		$('#awardList tbody tr').each(function (index, val) {
			var award = {};
			if (val.hasAttribute('title')) {
				award.award_name = false;
				award.name = $(val).find('td').eq(1).find('a').text();
				award.userid = $(val).find('td').eq(1).find('a').attr('href').replace('https://www.facebook.com/', '');
				award.message = $(val).find('td').eq(2).find('a').text();
				award.link = $(val).find('td').eq(2).find('a').attr('href');
				award.time = $(val).find('td').eq($(val).find('td').length - 1).text();
			} else {
				award.award_name = true;
				award.name = $(val).find('td').text();
			}
			awards.push(award);
		});
		var _iteratorNormalCompletion5 = true;
		var _didIteratorError5 = false;
		var _iteratorError5 = undefined;

		try {
			for (var _iterator5 = awards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
				var i = _step5.value;

				if (i.award_name === true) {
					li += '<li class="prizeName">' + i.name + '</li>';
				} else {
					li += '<li>\n\t\t\t\t<a href="https://www.facebook.com/' + i.userid + '" target="_blank"><img src="https://graph.facebook.com/' + i.userid + '/picture?type=large&access_token=' + config.pageToken + '" alt=""></a>\n\t\t\t\t<div class="info">\n\t\t\t\t<p class="name"><a href="https://www.facebook.com/' + i.userid + '" target="_blank">' + i.name + '</a></p>\n\t\t\t\t<p class="message"><a href="' + i.link + '" target="_blank">' + i.message + '</a></p>\n\t\t\t\t<p class="time"><a href="' + i.link + '" target="_blank">' + i.time + '</a></p>\n\t\t\t\t</div>\n\t\t\t\t</li>';
				}
			}
		} catch (err) {
			_didIteratorError5 = true;
			_iteratorError5 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion5 && _iterator5.return) {
					_iterator5.return();
				}
			} finally {
				if (_didIteratorError5) {
					throw _iteratorError5;
				}
			}
		}

		$('.big_award ul').append(li);
		$('.big_award').addClass('show');
	},
	close_big_award: function close_big_award() {
		$('.big_award').removeClass('show');
		$('.big_award ul').empty();
	}
};

var fbid = {
	fbid: [],
	init: function init(type) {
		fbid.fbid = [];
		data.init();
		FB.api("/me", function (res) {
			data.userid = res.id;
			var url = '';
			if (addLink) {
				url = fbid.format($('.morelink .addurl').val());
				$('.morelink .addurl').val('');
			} else {
				url = fbid.format($('#enterURL .url').val());
			}
			if (url.indexOf('.php?') === -1 && url.indexOf('?') > 0) {
				url = url.substring(0, url.indexOf('?'));
			}
			fbid.get(url, type).then(function (fbid) {
				data.start(fbid);
			});
			// $('.identity').removeClass('hide').html(`登入身份：<img src="https://graph.facebook.com/${res.id}/picture?type=small"><span>${res.name}</span>`);
		});
	},
	get: function get(url, type) {
		return new Promise(function (resolve, reject) {
			var regex = /\d{4,}/g;
			var newurl = url.substr(url.indexOf('/', 28) + 1, 200);
			// https://www.facebook.com/ 共25字元，因此選28開始找/
			var result = newurl.match(regex);
			var urltype = fbid.checkType(url);
			fbid.checkPageID(url, urltype).then(function (id) {
				if (id === 'personal') {
					urltype = 'personal';
					id = data.userid;
				}
				var obj = {
					pageID: id,
					type: urltype,
					command: type,
					data: []
				};
				if (addLink) obj.data = data.raw.data; //追加貼文
				if (urltype === 'personal') {
					var start = url.indexOf('fbid=');
					if (start >= 0) {
						var end = url.indexOf("&", start);
						obj.pureID = url.substring(start + 5, end);
					} else {
						var _start = url.indexOf('posts/');
						obj.pureID = url.substring(_start + 6, url.length);
					}
					var video = url.indexOf('videos/');
					if (video >= 0) {
						obj.pureID = result[0];
					}
					obj.fullID = obj.pageID + '_' + obj.pureID;
					resolve(obj);
				} else if (urltype === 'pure') {
					obj.fullID = url.replace(/\"/g, '');
					resolve(obj);
				} else {
					if (urltype === 'group') {

						obj.pureID = result[result.length - 1];
						obj.pageID = result[0];
						obj.fullID = obj.pageID + "_" + obj.pureID;
						resolve(obj);
					} else if (urltype === 'photo') {
						var _regex = /\d{4,}/g;
						var _result = url.match(_regex);
						obj.pureID = _result[_result.length - 1];
						obj.fullID = obj.pageID + '_' + obj.pureID;
						resolve(obj);
					} else if (urltype === 'video') {
						obj.pureID = result[result.length - 1];
						FB.api('/' + obj.pureID + '?fields=live_status', function (res) {
							if (res.live_status === 'LIVE') {
								obj.fullID = obj.pureID;
							} else {
								obj.fullID = obj.pageID + '_' + obj.pureID;
							}
							resolve(obj);
						});
					} else {
						if (result.length == 1 || result.length == 3) {
							obj.pureID = result[0];
							obj.fullID = obj.pageID + '_' + obj.pureID;
							resolve(obj);
						} else {
							if (urltype === 'unname') {
								obj.pureID = result[0];
								obj.pageID = result[result.length - 1];
							} else {
								obj.pureID = result[result.length - 1];
							}
							obj.fullID = obj.pageID + '_' + obj.pureID;
							FB.api('/' + obj.pageID + '?fields=access_token', function (res) {
								if (res.error) {
									resolve(obj);
								} else {
									if (res.access_token) {
										config.pageToken = res.access_token;
									}
									resolve(obj);
								}
							});
						}
					}
				}
			});
		});
	},
	checkType: function checkType(posturl) {
		if (posturl.indexOf("fbid=") >= 0) {
			if (posturl.indexOf('permalink') >= 0) {
				return 'unname';
			} else {
				return 'personal';
			}
		};
		if (posturl.indexOf("/groups/") >= 0) {
			return 'group';
		};
		if (posturl.indexOf("events") >= 0) {
			return 'event';
		};
		if (posturl.indexOf("/photos/") >= 0) {
			return 'photo';
		};
		if (posturl.indexOf("/videos/") >= 0) {
			return 'video';
		}
		if (posturl.indexOf('"') >= 0) {
			return 'pure';
		};
		return 'normal';
	},
	checkPageID: function checkPageID(posturl, type) {
		return new Promise(function (resolve, reject) {
			var start = posturl.indexOf("facebook.com") + 13;
			var end = posturl.indexOf("/", start);
			var regex = /\d{4,}/g;
			if (end < 0) {
				if (posturl.indexOf('fbid=') >= 0) {
					if (type === 'unname') {
						resolve('unname');
					} else {
						resolve('personal');
					}
				} else {
					resolve(posturl.match(regex)[1]);
				}
			} else {
				var group = posturl.indexOf('/groups/');
				var event = posturl.indexOf('/events/');
				if (group >= 0) {
					start = group + 8;
					end = posturl.indexOf("/", start);
					var regex2 = /\d{6,}/g;
					var temp = posturl.substring(start, end);
					if (regex2.test(temp)) {
						resolve(temp);
					} else {
						resolve('group');
					}
				} else if (event >= 0) {
					resolve('event');
				} else {
					var pagename = posturl.substring(start, end);
					FB.api('/' + pagename + '?fields=access_token', function (res) {
						if (res.error) {
							fberror = res.error.message;
							resolve('personal');
						} else {
							if (res.access_token) {
								config.pageToken = res.access_token;
							}
							resolve(res.id);
						}
					});
				}
			}
		});
	},
	format: function format(url) {
		if (url.indexOf('business.facebook.com/') >= 0) {
			url = url.substring(0, url.indexOf("?"));
			return url;
		} else {
			return url;
		}
	}
};

var _filter = {
	totalFilter: function totalFilter(rawdata, isDuplicate, isTag, word, react, startTime, endTime) {
		var data = rawdata.data;
		if (word !== '') {
			data = _filter.word(data, word);
		}
		if (isTag) {
			data = _filter.tag(data);
		}
		if (rawdata.command == 'reactions' || rawdata.command == 'likes' || config.likes) {
			data = _filter.react(data, react);
		} else if (rawdata.command === 'ranker') {} else {
			data = _filter.time(data, startTime, endTime);
		}
		if (isDuplicate) {
			data = _filter.unique(data);
		}

		return data;
	},
	unique: function unique(data) {
		var output = [];
		var keys = [];
		data.forEach(function (item) {
			var key = item.from.id;
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	},
	word: function word(data, _word) {
		var newAry = $.grep(data, function (n, i) {
			if (n.message === undefined) {
				if (n.story.indexOf(_word) > -1) {
					return true;
				}
			} else {
				if (n.message.indexOf(_word) > -1) {
					return true;
				}
			}
		});
		return newAry;
	},
	tag: function tag(data) {
		var newAry = $.grep(data, function (n, i) {
			if (n.message_tags) {
				return true;
			}
		});
		return newAry;
	},
	time: function time(data, st, t) {
		var time_ary2 = st.split("-");
		var time_ary = t.split("-");
		var endtime = moment(new Date(time_ary[0], parseInt(time_ary[1]) - 1, time_ary[2], time_ary[3], time_ary[4], time_ary[5]))._d;
		var starttime = moment(new Date(time_ary2[0], parseInt(time_ary2[1]) - 1, time_ary2[2], time_ary2[3], time_ary2[4], time_ary2[5]))._d;
		var newAry = $.grep(data, function (n, i) {
			var created_time = moment(n.created_time)._d;
			if (created_time > starttime && created_time < endtime || n.created_time == "") {
				return true;
			}
		});
		return newAry;
	},
	react: function react(data, tar) {
		if (tar == 'all') {
			return data;
		} else {
			var newAry = $.grep(data, function (n, i) {
				if (n.type == tar) {
					return true;
				}
			});
			return newAry;
		}
	}
};

var ui = {
	init: function init() {},
	addLink: function addLink() {
		var tar = $('.inputarea .morelink');
		if (tar.hasClass('show')) {
			tar.removeClass('show');
		} else {
			tar.addClass('show');
		}
	},
	reset: function reset() {
		var command = data.raw.command;
		if (command == 'reactions' || command == 'likes' || config.likes) {
			$('.limitTime, #searchComment').addClass('hide');
			$('.uipanel .react').removeClass('hide');
		} else {
			$('.limitTime, #searchComment').removeClass('hide');
			$('.uipanel .react').addClass('hide');
		}
		if (command === 'comments') {
			$('label.tag').removeClass('hide');
		} else {
			if ($("#tag").prop("checked")) {
				$("#tag").click();
			}
			$('label.tag').addClass('hide');
		}
	}
};
var page_selector = {
	pages: [],
	groups: [],
	show: function show() {
		$('.page_selector').removeClass('hide');
		page_selector.getAdmin();
	},
	getAdmin: function getAdmin() {
		Promise.all([page_selector.getPage(), page_selector.getGroup()]).then(function (res) {
			page_selector.genAdmin(res);
		});
	},
	getPage: function getPage() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + '/me/accounts?limit=100', function (res) {
				resolve(res.data);
			});
		});
	},
	getGroup: function getGroup() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + '/me/groups?fields=name,id,administrator&limit=100', function (res) {
				resolve(res.data.filter(function (item) {
					return item.administrator === true;
				}));
			});
		});
	},
	genAdmin: function genAdmin(res) {
		var pages = '';
		var groups = '';
		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;

		try {
			for (var _iterator6 = res[0][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var i = _step6.value;

				pages += '<div class="page_btn" data-type="1" data-value="' + i.id + '" onclick="page_selector.selectPage(this)">' + i.name + '</div>';
			}
		} catch (err) {
			_didIteratorError6 = true;
			_iteratorError6 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion6 && _iterator6.return) {
					_iterator6.return();
				}
			} finally {
				if (_didIteratorError6) {
					throw _iteratorError6;
				}
			}
		}

		var _iteratorNormalCompletion7 = true;
		var _didIteratorError7 = false;
		var _iteratorError7 = undefined;

		try {
			for (var _iterator7 = res[1][Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
				var _i = _step7.value;

				groups += '<div class="page_btn" data-type="2" data-value="' + _i.id + '" onclick="page_selector.selectPage(this)">' + _i.name + '</div>';
			}
		} catch (err) {
			_didIteratorError7 = true;
			_iteratorError7 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion7 && _iterator7.return) {
					_iterator7.return();
				}
			} finally {
				if (_didIteratorError7) {
					throw _iteratorError7;
				}
			}
		}

		$('.select_page').html(pages);
		$('.select_group').html(groups);
	},
	selectPage: function selectPage(target) {
		var page_id = $(target).data('value');
		if ($(target).data('type') == '1') {
			FB.api('/' + page_id + '?fields=access_token', function (res) {
				if (res.access_token) {
					config.pageToken = res.access_token;
				} else {
					config.pageToken = '';
				}
			});
		}
		FB.api(config.apiVersion.newest + '/' + page_id + '/feed?limit=100', function (res) {
			var tbody = '';
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = res.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var tr = _step8.value;

					tbody += '<tr><td><button type="button" onclick="page_selector.selectPost(\'' + tr.id + '\')">\u9078\u64C7\u8CBC\u6587</button></td><td><a href="https://www.facebook.com/' + tr.id + '" target="_blank">' + tr.message + '</a></td><td>' + timeConverter(tr.created_time) + '</td></tr>';
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			$('#post_table tbody').html(tbody);
		});
	},
	selectPost: function selectPost(fbid) {
		$('.page_selector').addClass('hide');
		$('.select_page').html('');
		$('.select_group').html('');
		$('#post_table tbody').html('');
		var id = '"' + fbid + '"';
		$('#enterURL .url').val(id);
	}
};

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
	var array = $.map(obj, function (value, index) {
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
	var arrData = (typeof JSONData === 'undefined' ? 'undefined' : _typeof(JSONData)) != 'object' ? JSON.parse(JSONData) : JSONData;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwiZmJlcnJvciIsIndpbmRvdyIsIm9uZXJyb3IiLCJoYW5kbGVFcnIiLCJUQUJMRSIsImxhc3RDb21tYW5kIiwiYWRkTGluayIsImF1dGhfc2NvcGUiLCJtc2ciLCJ1cmwiLCJsIiwiJCIsInZhbCIsImNvbnNvbGUiLCJsb2ciLCJhcHBlbmQiLCJmYWRlSW4iLCJkb2N1bWVudCIsInJlYWR5IiwiaGFzaCIsImxvY2F0aW9uIiwic2VhcmNoIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwiZGF0YSIsImV4dGVuc2lvbiIsImNsaWNrIiwiZSIsImZiIiwiZXh0ZW5zaW9uQXV0aCIsImRhdGFzIiwiY29tbWFuZCIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsInJhbmtlciIsInJhdyIsImZpbmlzaCIsImdldEF1dGgiLCJjdHJsS2V5IiwiYWx0S2V5IiwiY29uZmlnIiwib3JkZXIiLCJsaWtlcyIsImNob29zZSIsImluaXQiLCJ1aSIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJrZXlkb3duIiwidGV4dCIsImtleXVwIiwib24iLCJ0YWJsZSIsInJlZG8iLCJjaGFuZ2UiLCJmaWx0ZXIiLCJyZWFjdCIsImRhdGVyYW5nZXBpY2tlciIsInN0YXJ0IiwiZW5kIiwibGFiZWwiLCJzdGFydFRpbWUiLCJmb3JtYXQiLCJlbmRUaW1lIiwic2V0U3RhcnREYXRlIiwiZmlsdGVyRGF0YSIsImV4cG9ydFRvSnNvbkZpbGUiLCJleGNlbFN0cmluZyIsImV4Y2VsIiwic3RyaW5naWZ5IiwiY2lfY291bnRlciIsImltcG9ydCIsImZpbGVzIiwianNvbkRhdGEiLCJkYXRhU3RyIiwiZGF0YVVyaSIsImVuY29kZVVSSUNvbXBvbmVudCIsImV4cG9ydEZpbGVEZWZhdWx0TmFtZSIsImxpbmtFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsInNoYXJlQlROIiwiYWxlcnQiLCJmaWVsZCIsImNvbW1lbnRzIiwicmVhY3Rpb25zIiwic2hhcmVkcG9zdHMiLCJ1cmxfY29tbWVudHMiLCJmZWVkIiwibGltaXQiLCJhcGlWZXJzaW9uIiwiZ3JvdXAiLCJuZXdlc3QiLCJ3b3JkIiwibm93RGF0ZSIsImF1dGgiLCJwYWdlVG9rZW4iLCJmcm9tX2V4dGVuc2lvbiIsInVzZXJfcG9zdHMiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJhdXRoX3R5cGUiLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoUmVzcG9uc2UiLCJncmFudGVkU2NvcGVzIiwiaW5jbHVkZXMiLCJzd2FsIiwiZG9uZSIsInBhZ2Vfc2VsZWN0b3IiLCJzaG93IiwiZmJpZCIsImV4dGVuc2lvbkNhbGxiYWNrIiwidGl0bGUiLCJodG1sIiwiYXV0aE9LIiwicG9zdGRhdGEiLCJ1c2VyaWQiLCJub3dMZW5ndGgiLCJEYXRhVGFibGUiLCJkZXN0cm95IiwiaGlkZSIsImZ1bGxJRCIsImdldCIsInRoZW4iLCJyZXMiLCJpIiwicHVzaCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicHJvbWlzZV9hcnJheSIsInB1cmVJRCIsInRvU3RyaW5nIiwidG9rZW4iLCJhcGkiLCJsZW5ndGgiLCJkIiwiZnJvbSIsImlkIiwibmFtZSIsInVwZGF0ZWRfdGltZSIsImNyZWF0ZWRfdGltZSIsInBhZ2luZyIsIm5leHQiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2xpZGVVcCIsInNsaWRlRG93biIsInJlc2V0IiwicmF3RGF0YSIsImdlbmVyYXRlIiwiaXNEdXBsaWNhdGUiLCJwcm9wIiwiaXNUYWciLCJuZXdEYXRhIiwidG90YWxGaWx0ZXIiLCJvYmoyQXJyYXkiLCJmaWx0ZXJlZCIsIm5ld09iaiIsImVhY2giLCJ0bXAiLCJwb3N0bGluayIsIm1lc3NhZ2UiLCJzdG9yeSIsInRpbWVDb252ZXJ0ZXIiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImV2ZW50Iiwic3RyIiwidGFyZ2V0IiwicmVzdWx0IiwicmVhZEFzVGV4dCIsInJhd2RhdGEiLCJmaWx0ZXJkYXRhIiwidGhlYWQiLCJ0Ym9keSIsInBpYyIsImhvc3QiLCJlbnRyaWVzIiwiaiIsInBpY3R1cmUiLCJ0ZCIsInNjb3JlIiwibGluayIsImxpa2VfY291bnQiLCJ0ciIsImluc2VydCIsImFjdGl2ZSIsImNvbHVtbnMiLCJ2YWx1ZSIsImRyYXciLCJhd2FyZCIsIm51bSIsImRldGFpbCIsImxpc3QiLCJuIiwicGFyc2VJbnQiLCJmaW5kIiwicCIsImdvIiwiZ2VuUmFuZG9tQXJyYXkiLCJzcGxpY2UiLCJtYXAiLCJpbmRleCIsInJvd3MiLCJub2RlcyIsImlubmVySFRNTCIsIm5vdyIsImsiLCJ0YXIiLCJlcSIsImluc2VydEJlZm9yZSIsImdlbl9iaWdfYXdhcmQiLCJsaSIsImF3YXJkcyIsImhhc0F0dHJpYnV0ZSIsImF3YXJkX25hbWUiLCJhdHRyIiwidGltZSIsImNsb3NlX2JpZ19hd2FyZCIsImVtcHR5Iiwic3Vic3RyaW5nIiwicmVnZXgiLCJuZXd1cmwiLCJzdWJzdHIiLCJtYXRjaCIsInVybHR5cGUiLCJjaGVja1R5cGUiLCJjaGVja1BhZ2VJRCIsIm9iaiIsInBhZ2VJRCIsInZpZGVvIiwibGl2ZV9zdGF0dXMiLCJlcnJvciIsImFjY2Vzc190b2tlbiIsInBvc3R1cmwiLCJyZWdleDIiLCJ0ZW1wIiwidGVzdCIsInBhZ2VuYW1lIiwidGFnIiwidW5pcXVlIiwib3V0cHV0Iiwia2V5cyIsImZvckVhY2giLCJpdGVtIiwia2V5IiwibmV3QXJ5IiwiZ3JlcCIsInVuZGVmaW5lZCIsIm1lc3NhZ2VfdGFncyIsInN0IiwidCIsInRpbWVfYXJ5MiIsInNwbGl0IiwidGltZV9hcnkiLCJlbmR0aW1lIiwibW9tZW50IiwiRGF0ZSIsIl9kIiwic3RhcnR0aW1lIiwicGFnZXMiLCJncm91cHMiLCJnZXRBZG1pbiIsImFsbCIsImdldFBhZ2UiLCJnZXRHcm91cCIsImdlbkFkbWluIiwiYWRtaW5pc3RyYXRvciIsInNlbGVjdFBhZ2UiLCJwYWdlX2lkIiwic2VsZWN0UG9zdCIsImEiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF0ZSIsImdldERhdGUiLCJob3VyIiwiZ2V0SG91cnMiLCJtaW4iLCJnZXRNaW51dGVzIiwic2VjIiwiZ2V0U2Vjb25kcyIsIlVOSVhfdGltZXN0YW1wIiwibW9udGhzIiwiYXJyYXkiLCJhcnkiLCJBcnJheSIsInIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJocmVmIiwic3R5bGUiLCJkb3dubG9hZCIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLGVBQWUsS0FBbkI7QUFDQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQUMsT0FBT0MsT0FBUCxHQUFpQkMsU0FBakI7QUFDQSxJQUFJQyxLQUFKO0FBQ0EsSUFBSUMsY0FBYyxVQUFsQjtBQUNBLElBQUlDLFVBQVUsS0FBZDtBQUNBLElBQUlDLGFBQWEsRUFBakI7O0FBRUEsU0FBU0osU0FBVCxDQUFtQkssR0FBbkIsRUFBd0JDLEdBQXhCLEVBQTZCQyxDQUE3QixFQUFnQztBQUMvQixLQUFJLENBQUNYLFlBQUwsRUFBbUI7QUFDbEIsTUFBSVUsT0FBTUUsRUFBRSxnQkFBRixFQUFvQkMsR0FBcEIsRUFBVjtBQUNBQyxVQUFRQyxHQUFSLENBQVksbUNBQVosRUFBaUQsNEJBQWpEO0FBQ0FELFVBQVFDLEdBQVIsQ0FBWSxzQkFBc0JMLElBQWxDO0FBQ0FFLElBQUUsaUJBQUYsRUFBcUJJLE1BQXJCLGNBQXVDZixPQUF2QyxnQkFBeURTLElBQXpEO0FBQ0FFLElBQUUsaUJBQUYsRUFBcUJLLE1BQXJCO0FB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QUFRakwsQ0FBUixFQUFXa0YsS0FBWCxDQUFOLEdBQTBCLElBQWpDO0FBQ0E7O0FBRURpRyxNQUFJQyxLQUFKLENBQVUsQ0FBVixFQUFhRCxJQUFJekssTUFBSixHQUFhLENBQTFCOztBQUVBO0FBQ0F3SyxTQUFPQyxNQUFNLE1BQWI7QUFDQTs7QUFFRCxLQUFJRCxPQUFPLEVBQVgsRUFBZTtBQUNkbE8sUUFBTSxjQUFOO0FBQ0E7QUFDQTs7QUFFRDtBQUNBLEtBQUlxTyxXQUFXLEVBQWY7QUFDQTtBQUNBQSxhQUFZTixZQUFZM0osT0FBWixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFaOztBQUVBO0FBQ0EsS0FBSWtLLE1BQU0sdUNBQXVDQyxVQUFVTCxHQUFWLENBQWpEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSXBILE9BQU9oTCxTQUFTK0QsYUFBVCxDQUF1QixHQUF2QixDQUFYO0FBQ0FpSCxNQUFLMEgsSUFBTCxHQUFZRixHQUFaOztBQUVBO0FBQ0F4SCxNQUFLMkgsS0FBTCxHQUFhLG1CQUFiO0FBQ0EzSCxNQUFLNEgsUUFBTCxHQUFnQkwsV0FBVyxNQUEzQjs7QUFFQTtBQUNBdlMsVUFBUzZTLElBQVQsQ0FBY0MsV0FBZCxDQUEwQjlILElBQTFCO0FBQ0FBLE1BQUt2SyxLQUFMO0FBQ0FULFVBQVM2UyxJQUFULENBQWNFLFdBQWQsQ0FBMEIvSCxJQUExQjtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZXJyb3JNZXNzYWdlID0gZmFsc2U7XHJcbnZhciBmYmVycm9yID0gJyc7XHJcbndpbmRvdy5vbmVycm9yID0gaGFuZGxlRXJyO1xyXG52YXIgVEFCTEU7XHJcbnZhciBsYXN0Q29tbWFuZCA9ICdjb21tZW50cyc7XHJcbnZhciBhZGRMaW5rID0gZmFsc2U7XHJcbnZhciBhdXRoX3Njb3BlID0gJyc7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVFcnIobXNnLCB1cmwsIGwpIHtcclxuXHRpZiAoIWVycm9yTWVzc2FnZSkge1xyXG5cdFx0bGV0IHVybCA9ICQoJyNlbnRlclVSTCAudXJsJykudmFsKCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkVycm9yIG9jY3VyIFVSTO+8miBcIiArIHVybCk7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmFwcGVuZChgPGJyPjxicj4ke2ZiZXJyb3J9PGJyPjxicj4ke3VybH1gKTtcclxuXHRcdCQoXCIuY29uc29sZSAuZXJyb3JcIikuZmFkZUluKCk7XHJcblx0XHRlcnJvck1lc3NhZ2UgPSB0cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmFsc2U7XHJcbn1cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGxldCBoYXNoID0gbG9jYXRpb24uc2VhcmNoO1xyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJleHRlbnNpb25cIikgPj0gMCkge1xyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aFwiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHRkYXRhLmV4dGVuc2lvbiA9IHRydWU7XHJcblxyXG5cdFx0JChcIi5sb2FkaW5nLmNoZWNrQXV0aCBidXR0b25cIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQXV0aCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGlmIChoYXNoLmluZGV4T2YoXCJyYW5rZXJcIikgPj0gMCkge1xyXG5cdFx0bGV0IGRhdGFzID0ge1xyXG5cdFx0XHRjb21tYW5kOiAncmFua2VyJyxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UucmFua2VyKVxyXG5cdFx0fVxyXG5cdFx0ZGF0YS5yYXcgPSBkYXRhcztcclxuXHRcdGRhdGEuZmluaXNoKGRhdGEucmF3KTtcclxuXHR9XHJcblxyXG5cdCQoXCIjYnRuX3BhZ2Vfc2VsZWN0b3JcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGZiLmdldEF1dGgoJ3BhZ2Vfc2VsZWN0b3InKTtcclxuXHR9KTtcclxuXHJcblx0JChcIiNidG5fY29tbWVudHNcIikuY2xpY2soZnVuY3Rpb24gKGUpIHtcclxuXHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0aWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHRjb25maWcub3JkZXIgPSAnY2hyb25vbG9naWNhbCc7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdjb21tZW50cycpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9saWtlXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5KSB7XHJcblx0XHRcdGNvbmZpZy5saWtlcyA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRmYi5nZXRBdXRoKCdyZWFjdGlvbnMnKTtcclxuXHR9KTtcclxuXHQkKFwiI2J0bl91cmxcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0ZmIuZ2V0QXV0aCgndXJsX2NvbW1lbnRzJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fcGF5XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGZiLmdldEF1dGgoJ2FkZFNjb3BlJyk7XHJcblx0fSk7XHJcblx0JChcIiNidG5fY2hvb3NlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGNob29zZS5pbml0KCk7XHJcblx0fSk7XHJcblx0JChcIiNtb3JlcG9zdFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHR1aS5hZGRMaW5rKCk7XHJcblx0fSk7XHJcblxyXG5cdCQoXCIjbW9yZXByaXplXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikuYWRkQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5hZGRDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChcIiNlbmRUaW1lXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYWN0aXZlXCIpKSB7XHJcblx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2J0bl9hZGRQcml6ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHQkKFwiLnByaXplRGV0YWlsXCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInByaXplXCI+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5ZOB5ZCN77yaPGlucHV0IHR5cGU9XCJ0ZXh0XCI+PC9kaXY+PGRpdiBjbGFzcz1cImlucHV0X2dyb3VwXCI+5oq9542O5Lq65pW477yaPGlucHV0IHR5cGU9XCJudW1iZXJcIj48L2Rpdj48L2Rpdj5gKTtcclxuXHR9KTtcclxuXHJcblx0JCh3aW5kb3cpLmtleWRvd24oZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0JChcIiNidG5fZXhjZWxcIikudGV4dChcIui8uOWHukpTT05cIik7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0JCh3aW5kb3cpLmtleXVwKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoIWUuY3RybEtleSB8fCBlLmFsdEtleSkge1xyXG5cdFx0XHQkKFwiI2J0bl9leGNlbFwiKS50ZXh0KFwi6KSH6KO96KGo5qC85YWn5a65XCIpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI3VuaXF1ZSwgI3RhZ1wiKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0dGFibGUucmVkbygpO1xyXG5cdH0pO1xyXG5cclxuXHQkKFwiLnVpcGFuZWwgLnJlYWN0XCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25maWcuZmlsdGVyLnJlYWN0ID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHJcblx0JCgnLnJhbmdlRGF0ZScpLmRhdGVyYW5nZXBpY2tlcih7XHJcblx0XHRcInRpbWVQaWNrZXJcIjogdHJ1ZSxcclxuXHRcdFwidGltZVBpY2tlcjI0SG91clwiOiB0cnVlLFxyXG5cdFx0XCJsb2NhbGVcIjoge1xyXG5cdFx0XHRcImZvcm1hdFwiOiBcIllZWVkvTU0vREQgSEg6bW1cIixcclxuXHRcdFx0XCJzZXBhcmF0b3JcIjogXCItXCIsXHJcblx0XHRcdFwiYXBwbHlMYWJlbFwiOiBcIueiuuWumlwiLFxyXG5cdFx0XHRcImNhbmNlbExhYmVsXCI6IFwi5Y+W5raIXCIsXHJcblx0XHRcdFwiZnJvbUxhYmVsXCI6IFwiRnJvbVwiLFxyXG5cdFx0XHRcInRvTGFiZWxcIjogXCJUb1wiLFxyXG5cdFx0XHRcImN1c3RvbVJhbmdlTGFiZWxcIjogXCJDdXN0b21cIixcclxuXHRcdFx0XCJkYXlzT2ZXZWVrXCI6IFtcclxuXHRcdFx0XHRcIuaXpVwiLFxyXG5cdFx0XHRcdFwi5LiAXCIsXHJcblx0XHRcdFx0XCLkuoxcIixcclxuXHRcdFx0XHRcIuS4iVwiLFxyXG5cdFx0XHRcdFwi5ZubXCIsXHJcblx0XHRcdFx0XCLkupRcIixcclxuXHRcdFx0XHRcIuWFrVwiXHJcblx0XHRcdF0sXHJcblx0XHRcdFwibW9udGhOYW1lc1wiOiBbXHJcblx0XHRcdFx0XCLkuIDmnIhcIixcclxuXHRcdFx0XHRcIuS6jOaciFwiLFxyXG5cdFx0XHRcdFwi5LiJ5pyIXCIsXHJcblx0XHRcdFx0XCLlm5vmnIhcIixcclxuXHRcdFx0XHRcIuS6lOaciFwiLFxyXG5cdFx0XHRcdFwi5YWt5pyIXCIsXHJcblx0XHRcdFx0XCLkuIPmnIhcIixcclxuXHRcdFx0XHRcIuWFq+aciFwiLFxyXG5cdFx0XHRcdFwi5Lmd5pyIXCIsXHJcblx0XHRcdFx0XCLljYHmnIhcIixcclxuXHRcdFx0XHRcIuWNgeS4gOaciFwiLFxyXG5cdFx0XHRcdFwi5Y2B5LqM5pyIXCJcclxuXHRcdFx0XSxcclxuXHRcdFx0XCJmaXJzdERheVwiOiAxXHJcblx0XHR9LFxyXG5cdH0sIGZ1bmN0aW9uIChzdGFydCwgZW5kLCBsYWJlbCkge1xyXG5cdFx0Y29uZmlnLmZpbHRlci5zdGFydFRpbWUgPSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdGNvbmZpZy5maWx0ZXIuZW5kVGltZSA9IGVuZC5mb3JtYXQoJ1lZWVktTU0tREQtSEgtbW0tc3MnKTtcclxuXHRcdHRhYmxlLnJlZG8oKTtcclxuXHR9KTtcclxuXHQkKCcucmFuZ2VEYXRlJykuZGF0YSgnZGF0ZXJhbmdlcGlja2VyJykuc2V0U3RhcnREYXRlKGNvbmZpZy5maWx0ZXIuc3RhcnRUaW1lKTtcclxuXHJcblxyXG5cdCQoXCIjYnRuX2V4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRsZXQgZmlsdGVyRGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHRcdFx0ZXhwb3J0VG9Kc29uRmlsZShmaWx0ZXJEYXRhKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIGlmIChmaWx0ZXJEYXRhLmxlbmd0aCA+IDcwMDApIHtcclxuXHRcdFx0Ly8gXHQkKFwiLmJpZ0V4Y2VsXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0Ly8gXHRKU09OVG9DU1ZDb252ZXJ0b3IoZGF0YS5leGNlbChmaWx0ZXJEYXRhKSwgXCJDb21tZW50X2hlbHBlclwiLCB0cnVlKTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKFwiI2dlbkV4Y2VsXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBmaWx0ZXJEYXRhID0gZGF0YS5maWx0ZXIoZGF0YS5yYXcpO1xyXG5cdFx0dmFyIGV4Y2VsU3RyaW5nID0gZGF0YS5leGNlbChmaWx0ZXJEYXRhKVxyXG5cdFx0JChcIiNleGNlbGRhdGFcIikudmFsKEpTT04uc3RyaW5naWZ5KGV4Y2VsU3RyaW5nKSk7XHJcblx0fSk7XHJcblxyXG5cdGxldCBjaV9jb3VudGVyID0gMDtcclxuXHQkKFwiLmNpXCIpLmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcblx0XHRjaV9jb3VudGVyKys7XHJcblx0XHRpZiAoY2lfY291bnRlciA+PSA1KSB7XHJcblx0XHRcdCQoXCIuc291cmNlIC51cmwsIC5zb3VyY2UgLmJ0blwiKS5hZGRDbGFzcyhcImhpZGVcIik7XHJcblx0XHRcdCQoXCIjaW5wdXRKU09OXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdH1cclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkpIHtcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblx0JChcIiNpbnB1dEpTT05cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoXCIud2FpdGluZ1wiKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5oiq5Y+W5a6M5oiQ77yM55Si55Sf6KGo5qC85LitLi4uLuethuaVuOi8g+WkmuaZguacg+mcgOimgeiKsei8g+WkmuaZgumWk++8jOiri+eojeWAmScpO1xyXG5cdFx0ZGF0YS5pbXBvcnQodGhpcy5maWxlc1swXSk7XHJcblx0fSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZXhwb3J0VG9Kc29uRmlsZShqc29uRGF0YSkge1xyXG4gICAgbGV0IGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShqc29uRGF0YSk7XHJcbiAgICBsZXQgZGF0YVVyaSA9ICdkYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCwnKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVN0cik7XHJcbiAgICBcclxuICAgIGxldCBleHBvcnRGaWxlRGVmYXVsdE5hbWUgPSAnZGF0YS5qc29uJztcclxuICAgIFxyXG4gICAgbGV0IGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgbGlua0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVVyaSk7XHJcbiAgICBsaW5rRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZXhwb3J0RmlsZURlZmF1bHROYW1lKTtcclxuICAgIGxpbmtFbGVtZW50LmNsaWNrKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNoYXJlQlROKCkge1xyXG5cdGFsZXJ0KCfoqo3nnJ/nnIvlrozot7Plh7rkvobnmoTpgqPpoIHkuIrpnaLlr6vkuobku4DpurxcXG5cXG7nnIvlrozkvaDlsLHmnIPnn6XpgZPkvaDngrrku4DpurzkuI3og73mipPliIbkuqsnKTtcclxufVxyXG5cclxubGV0IGNvbmZpZyA9IHtcclxuXHRmaWVsZDoge1xyXG5cdFx0Y29tbWVudHM6IFsnbGlrZV9jb3VudCcsICdtZXNzYWdlX3RhZ3MnLCAnbWVzc2FnZScsICdmcm9tJywgJ2NyZWF0ZWRfdGltZSddLFxyXG5cdFx0cmVhY3Rpb25zOiBbXSxcclxuXHRcdHNoYXJlZHBvc3RzOiBbJ3N0b3J5JywgJ2Zyb20nLCAnY3JlYXRlZF90aW1lJ10sXHJcblx0XHR1cmxfY29tbWVudHM6IFtdLFxyXG5cdFx0ZmVlZDogWydjcmVhdGVkX3RpbWUnLCAnZnJvbScsICdtZXNzYWdlJywgJ3N0b3J5J10sXHJcblx0XHRsaWtlczogWyduYW1lJ11cclxuXHR9LFxyXG5cdGxpbWl0OiB7XHJcblx0XHRjb21tZW50czogJzE1JyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCcsXHJcblx0XHRsaWtlczogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjYuMCcsXHJcblx0XHRyZWFjdGlvbnM6ICd2Ni4wJyxcclxuXHRcdHNoYXJlZHBvc3RzOiAndjYuMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICd2Ni4wJyxcclxuXHRcdGZlZWQ6ICd2Ni4wJyxcclxuXHRcdGdyb3VwOiAndjYuMCcsXHJcblx0XHRuZXdlc3Q6ICd2Ni4wJ1xyXG5cdH0sXHJcblx0ZmlsdGVyOiB7XHJcblx0XHR3b3JkOiAnJyxcclxuXHRcdHJlYWN0OiAnYWxsJyxcclxuXHRcdHN0YXJ0VGltZTogJzIwMDAtMTItMzEtMDAtMDAtMDAnLFxyXG5cdFx0ZW5kVGltZTogbm93RGF0ZSgpXHJcblx0fSxcclxuXHRvcmRlcjogJ2Nocm9ub2xvZ2ljYWwnLFxyXG5cdGF1dGg6ICdtYW5hZ2VfcGFnZXMsZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mbycsXHJcblx0bGlrZXM6IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcblx0ZnJvbV9leHRlbnNpb246IGZhbHNlLFxyXG59XHJcblxyXG5sZXQgZmIgPSB7XHJcblx0dXNlcl9wb3N0czogZmFsc2UsXHJcblx0Z2V0QXV0aDogKHR5cGUgPSAnJykgPT4ge1xyXG5cdFx0aWYgKHR5cGUgPT09ICcnKSB7XHJcblx0XHRcdGFkZExpbmsgPSB0cnVlO1xyXG5cdFx0XHR0eXBlID0gbGFzdENvbW1hbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhZGRMaW5rID0gZmFsc2U7XHJcblx0XHRcdGxhc3RDb21tYW5kID0gdHlwZTtcclxuXHRcdH1cclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdGF1dGhfdHlwZTogJ3JlcmVxdWVzdCcgLFxyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Y2FsbGJhY2s6IChyZXNwb25zZSwgdHlwZSkgPT4ge1xyXG5cdFx0Ly8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRjb25maWcuZnJvbV9leHRlbnNpb24gPSBmYWxzZTtcclxuXHRcdFx0aWYgKHR5cGUgPT0gXCJhZGRTY29wZVwiKSB7XHJcblx0XHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0XHQn5LuY6LK75o6I5qyK5a6M5oiQ77yM6KuL5YaN5qyh5Z+36KGM5oqT55WZ6KiAJyxcclxuXHRcdFx0XHRcdFx0J0F1dGhvcml6YXRpb24gRmluaXNoZWQhIFBsZWFzZSBnZXRDb21tZW50cyBhZ2Fpbi4nLFxyXG5cdFx0XHRcdFx0XHQnc3VjY2VzcydcclxuXHRcdFx0XHRcdCkuZG9uZSgpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0c3dhbChcclxuXHRcdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOipsuWKn+iDvemcgOS7mOiyuycsXHJcblx0XHRcdFx0XHRcdCdBdXRob3JpemF0aW9uIEZhaWxlZCEgSXQgaXMgYSBwYWlkIGZlYXR1cmUuJyxcclxuXHRcdFx0XHRcdFx0J2Vycm9yJ1xyXG5cdFx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gXCJwYWdlX3NlbGVjdG9yXCIpIHtcdFxyXG5cdFx0XHRcdHBhZ2Vfc2VsZWN0b3Iuc2hvdygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZiLnVzZXJfcG9zdHMgPSB0cnVlO1xyXG5cdFx0XHRcdGZiaWQuaW5pdCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0RkIubG9naW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0ZmIuY2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0c2NvcGU6IGNvbmZpZy5hdXRoLFxyXG5cdFx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleHRlbnNpb25BdXRoOiAoKSA9PiB7XHJcblx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0ZmIuZXh0ZW5zaW9uQ2FsbGJhY2socmVzcG9uc2UpO1xyXG5cdFx0fSwge1xyXG5cdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdHJldHVybl9zY29wZXM6IHRydWVcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0ZXh0ZW5zaW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xyXG5cdFx0aWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcclxuXHRcdFx0Y29uZmlnLmZyb21fZXh0ZW5zaW9uID0gdHJ1ZTtcclxuXHRcdFx0YXV0aF9zY29wZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZS5ncmFudGVkU2NvcGVzO1xyXG5cdFx0XHRpZiAoYXV0aF9zY29wZS5pbmRleE9mKFwiZ3JvdXBzX2FjY2Vzc19tZW1iZXJfaW5mb1wiKSA8IDApIHtcclxuXHRcdFx0XHRzd2FsKHtcclxuXHRcdFx0XHRcdHRpdGxlOiAn5oqT5YiG5Lqr6ZyA5LuY6LK777yM6Kmz5oOF6KuL6KaL57KJ57Wy5bCI6aCBJyxcclxuXHRcdFx0XHRcdGh0bWw6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2NvbW1lbnRoZWxwZXIvPC9hPicsXHJcblx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHR9KS5kb25lKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmIuYXV0aE9LKCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdGZiLmV4dGVuc2lvbkNhbGxiYWNrKHJlc3BvbnNlKTtcclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0XHRyZXR1cm5fc2NvcGVzOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YXV0aE9LOiAoKSA9PiB7XHJcblx0XHQkKFwiLmxvYWRpbmcuY2hlY2tBdXRoXCIpLmFkZENsYXNzKFwiaGlkZVwiKTtcclxuXHRcdGxldCBwb3N0ZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLnBvc3RkYXRhKTtcclxuXHRcdGxldCBkYXRhcyA9IHtcclxuXHRcdFx0Y29tbWFuZDogcG9zdGRhdGEuY29tbWFuZCxcclxuXHRcdFx0ZGF0YTogSlNPTi5wYXJzZSgkKFwiLmNocm9tZVwiKS52YWwoKSlcclxuXHRcdH1cclxuXHRcdGRhdGEucmF3ID0gZGF0YXM7XHJcblx0XHRkYXRhLmZpbmlzaChkYXRhLnJhdyk7XHJcblx0fVxyXG59XHJcblxyXG5sZXQgZGF0YSA9IHtcclxuXHRyYXc6IFtdLFxyXG5cdHVzZXJpZDogJycsXHJcblx0bm93TGVuZ3RoOiAwLFxyXG5cdGV4dGVuc2lvbjogZmFsc2UsXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmhpZGUoKTtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCfmiKrlj5bos4fmlpnkuK0uLi4nKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGlmICghYWRkTGluaykge1xyXG5cdFx0XHRkYXRhLnJhdyA9IFtdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0c3RhcnQ6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JCgnLnB1cmVfZmJpZCcpLnRleHQoZmJpZC5mdWxsSUQpO1xyXG5cdFx0ZGF0YS5nZXQoZmJpZCkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdC8vIGZiaWQuZGF0YSA9IHJlcztcclxuXHRcdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0XHRmYmlkLmRhdGEucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRkYXRhLmZpbmlzaChmYmlkKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAoZmJpZCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGRhdGFzID0gW107XHJcblx0XHRcdGxldCBwcm9taXNlX2FycmF5ID0gW107XHJcblx0XHRcdGxldCBjb21tYW5kID0gZmJpZC5jb21tYW5kO1xyXG5cdFx0XHRpZiAoZmJpZC50eXBlID09PSAnZ3JvdXAnKXtcclxuXHRcdFx0XHRmYmlkLmZ1bGxJRCA9IGZiaWQucHVyZUlEO1xyXG5cdFx0XHRcdGNvbW1hbmQgPSAnZ3JvdXAnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChmYmlkLnR5cGUgPT09ICdncm91cCcgJiYgZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnKSB7XHJcblx0XHRcdFx0ZmJpZC5mdWxsSUQgPSBmYmlkLnB1cmVJRDtcclxuXHRcdFx0XHRmYmlkLmNvbW1hbmQgPSAnbGlrZXMnO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjb25maWcubGlrZXMpIGZiaWQuY29tbWFuZCA9ICdsaWtlcyc7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mZmllbGRzPSR7Y29uZmlnLmZpZWxkW2ZiaWQuY29tbWFuZF0udG9TdHJpbmcoKX0mZGVidWc9YWxsYCk7XHJcblx0XHRcdGxldCB0b2tlbiA9IGNvbmZpZy5wYWdlVG9rZW4gPT0gJycgPyAnJzpgJmFjY2Vzc190b2tlbj0ke2NvbmZpZy5wYWdlVG9rZW59YDtcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uW2NvbW1hbmRdfS8ke2ZiaWQuZnVsbElEfS8ke2ZiaWQuY29tbWFuZH0/bGltaXQ9JHtjb25maWcubGltaXRbZmJpZC5jb21tYW5kXX0mb3JkZXI9JHtjb25maWcub3JkZXJ9JmZpZWxkcz0ke2NvbmZpZy5maWVsZFtmYmlkLmNvbW1hbmRdLnRvU3RyaW5nKCl9JHt0b2tlbn0mZGVidWc9YWxsYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdGlmICgoZmJpZC5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IGZiaWQuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdG5hbWU6IGQubmFtZVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKGNvbmZpZy5saWtlcykgZC50eXBlID0gXCJMSUtFXCI7XHJcblx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdGQuZnJvbSA9IHtcclxuXHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGlmIChkLnVwZGF0ZWRfdGltZSkge1xyXG5cdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZGF0YXMucHVzaChkKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGlmIChkLmlkKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKChmYmlkLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgZmJpZC5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0ZC5mcm9tID0ge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZDogZC5pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZTogZC5uYW1lXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5mcm9tKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2V2ZW50XHJcblx0XHRcdFx0XHRcdFx0XHRkLmZyb20gPSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlkOiBkLmlkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lOiBkLmlkXHJcblx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGQudXBkYXRlZF90aW1lKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGQuY3JlYXRlZF90aW1lID0gZC51cGRhdGVkX3RpbWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRkYXRhcy5wdXNoKGQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDAgJiYgcmVzLnBhZ2luZy5uZXh0KSB7XHJcblx0XHRcdFx0XHQvLyBpZiAoZGF0YS5ub3dMZW5ndGggPCAxODApIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmaW5pc2g6IChmYmlkKSA9PiB7XHJcblx0XHQkKFwiLndhaXRpbmdcIikuYWRkQ2xhc3MoXCJoaWRlXCIpO1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKTtcclxuXHRcdCQoXCIudXBkYXRlX2FyZWEsLmRvbmF0ZV9hcmVhXCIpLnNsaWRlVXAoKTtcclxuXHRcdCQoXCIucmVzdWx0X2FyZWFcIikuc2xpZGVEb3duKCk7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PSAnZ3JvdXAnKXtcclxuXHRcdFx0aWYgKGF1dGhfc2NvcGUuaW5jbHVkZXMoJ2dyb3Vwc19hY2Nlc3NfbWVtYmVyX2luZm8nKSl7XHJcblx0XHRcdFx0c3dhbCgn5a6M5oiQ77yBJywgJ0RvbmUhJywgJ3N1Y2Nlc3MnKS5kb25lKCk7XHJcblx0XHRcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0XHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHRcdFx0XHR1aS5yZXNldCgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzd2FsKFxyXG5cdFx0XHRcdFx0J+S7mOiyu+aOiOasiuaqouafpemMr+iqpO+8jOaKk+ekvuWcmOiyvOaWh+mcgOS7mOiyuycsXHJcblx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIEl0IGlzIGEgcGFpZCBmZWF0dXJlLicsXHJcblx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0KS5kb25lKCk7XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRzd2FsKCflrozmiJDvvIEnLCAnRG9uZSEnLCAnc3VjY2VzcycpLmRvbmUoKTtcclxuXHRcdFx0ZGF0YS5yYXcgPSBmYmlkO1xyXG5cdFx0XHRkYXRhLmZpbHRlcihkYXRhLnJhdywgdHJ1ZSk7XHJcblx0XHRcdHVpLnJlc2V0KCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRmaWx0ZXI6IChyYXdEYXRhLCBnZW5lcmF0ZSA9IGZhbHNlKSA9PiB7XHJcblx0XHRsZXQgaXNEdXBsaWNhdGUgPSAkKFwiI3VuaXF1ZVwiKS5wcm9wKFwiY2hlY2tlZFwiKTtcclxuXHRcdGxldCBpc1RhZyA9ICQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0Ly8gaWYgKGNvbmZpZy5mcm9tX2V4dGVuc2lvbiA9PT0gZmFsc2UgJiYgcmF3RGF0YS5jb21tYW5kID09PSAnY29tbWVudHMnKSB7XHJcblx0XHQvLyBcdHJhd0RhdGEuZGF0YSA9IHJhd0RhdGEuZGF0YS5maWx0ZXIoaXRlbSA9PiB7XHJcblx0XHQvLyBcdFx0cmV0dXJuIGl0ZW0uaXNfaGlkZGVuID09PSBmYWxzZVxyXG5cdFx0Ly8gXHR9KTtcclxuXHRcdC8vIH1cclxuXHRcdGxldCBuZXdEYXRhID0gZmlsdGVyLnRvdGFsRmlsdGVyKHJhd0RhdGEsIGlzRHVwbGljYXRlLCBpc1RhZywgLi4ub2JqMkFycmF5KGNvbmZpZy5maWx0ZXIpKTtcclxuXHRcdHJhd0RhdGEuZmlsdGVyZWQgPSBuZXdEYXRhO1xyXG5cdFx0aWYgKGdlbmVyYXRlID09PSB0cnVlKSB7XHJcblx0XHRcdHRhYmxlLmdlbmVyYXRlKHJhd0RhdGEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHJhd0RhdGE7XHJcblx0XHR9XHJcblx0fSxcclxuXHRleGNlbDogKHJhdykgPT4ge1xyXG5cdFx0dmFyIG5ld09iaiA9IFtdO1xyXG5cdFx0Y29uc29sZS5sb2cocmF3KTtcclxuXHRcdGlmIChkYXRhLmV4dGVuc2lvbikge1xyXG5cdFx0XHRpZiAocmF3LmNvbW1hbmQgPT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHRcdCQuZWFjaChyYXcuZmlsdGVyZWQsIGZ1bmN0aW9uIChpKSB7XHJcblx0XHRcdFx0XHR2YXIgdG1wID0ge1xyXG5cdFx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFx0XCLoh4nmm7jpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5mcm9tLmlkLFxyXG5cdFx0XHRcdFx0XHRcIuWnk+WQjVwiOiB0aGlzLmZyb20ubmFtZSxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDpgKPntZBcIjogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8nICsgdGhpcy5wb3N0bGluayxcclxuXHRcdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3T2JqLnB1c2godG1wKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0dmFyIHRtcCA9IHtcclxuXHRcdFx0XHRcdFx0XCLluo/omZ9cIjogaSArIDEsXHJcblx0XHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFx0XCLlp5PlkI1cIjogdGhpcy5mcm9tLm5hbWUsXHJcblx0XHRcdFx0XHRcdFwi5YiG5Lqr6YCj57WQXCI6IHRoaXMucG9zdGxpbmssXHJcblx0XHRcdFx0XHRcdFwi55WZ6KiA5YWn5a65XCI6IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkLmVhY2gocmF3LmZpbHRlcmVkLCBmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdHZhciB0bXAgPSB7XHJcblx0XHRcdFx0XHRcIuW6j+iZn1wiOiBpICsgMSxcclxuXHRcdFx0XHRcdFwi6IeJ5pu46YCj57WQXCI6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJyArIHRoaXMuZnJvbS5pZCxcclxuXHRcdFx0XHRcdFwi5aeT5ZCNXCI6IHRoaXMuZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0XCLooajmg4VcIjogdGhpcy50eXBlIHx8ICcnLFxyXG5cdFx0XHRcdFx0XCLnlZnoqIDlhaflrrlcIjogdGhpcy5tZXNzYWdlIHx8IHRoaXMuc3RvcnksXHJcblx0XHRcdFx0XHRcIueVmeiogOaZgumWk1wiOiB0aW1lQ29udmVydGVyKHRoaXMuY3JlYXRlZF90aW1lKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdPYmoucHVzaCh0bXApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXdPYmo7XHJcblx0fSxcclxuXHRpbXBvcnQ6IChmaWxlKSA9PiB7XHJcblx0XHRsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcblx0XHRyZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdGxldCBzdHIgPSBldmVudC50YXJnZXQucmVzdWx0O1xyXG5cdFx0XHRkYXRhLnJhdyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuXHRcdFx0ZGF0YS5maW5pc2goZGF0YS5yYXcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IHRhYmxlID0ge1xyXG5cdGdlbmVyYXRlOiAocmF3ZGF0YSkgPT4ge1xyXG5cdFx0JChcIi5tYWluX3RhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdGxldCBmaWx0ZXJkYXRhID0gcmF3ZGF0YS5maWx0ZXJlZDtcclxuXHRcdGxldCB0aGVhZCA9ICcnO1xyXG5cdFx0bGV0IHRib2R5ID0gJyc7XHJcblx0XHRsZXQgcGljID0gJChcIiNwaWN0dXJlXCIpLnByb3AoXCJjaGVja2VkXCIpO1xyXG5cdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZD7ooajmg4U8L3RkPmA7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHR0aGVhZCA9IGA8dGQ+5bqP6JmfPC90ZD5cclxuXHRcdFx0PHRkPuWQjeWtlzwvdGQ+XHJcblx0XHRcdDx0ZCBjbGFzcz1cImZvcmNlLWJyZWFrXCI+55WZ6KiA5YWn5a65PC90ZD5cclxuXHRcdFx0PHRkIHdpZHRoPVwiMTEwXCI+55WZ6KiA5pmC6ZaTPC90ZD5gO1xyXG5cdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7mjpLlkI08L3RkPlxyXG5cdFx0XHQ8dGQ+5ZCN5a2XPC90ZD5cclxuXHRcdFx0PHRkPuWIhuaVuDwvdGQ+YDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoZWFkID0gYDx0ZD7luo/omZ88L3RkPlxyXG5cdFx0XHQ8dGQgd2lkdGg9XCIyMDBcIj7lkI3lrZc8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPueVmeiogOWFp+WuuTwvdGQ+XHJcblx0XHRcdDx0ZD7orpo8L3RkPlxyXG5cdFx0XHQ8dGQgY2xhc3M9XCJub3dyYXBcIj7nlZnoqIDmmYLplpM8L3RkPmA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGhvc3QgPSAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLyc7XHJcblx0XHRpZiAoZGF0YS5yYXcudHlwZSA9PT0gJ3VybF9jb21tZW50cycpIGhvc3QgPSAkKCcjZW50ZXJVUkwgLnVybCcpLnZhbCgpICsgJz9mYl9jb21tZW50X2lkPSc7XHJcblxyXG5cdFx0Zm9yIChsZXQgW2osIHZhbF0gb2YgZmlsdGVyZGF0YS5lbnRyaWVzKCkpIHtcclxuXHRcdFx0bGV0IHBpY3R1cmUgPSAnJztcclxuXHRcdFx0aWYgKHBpYykge1xyXG5cdFx0XHRcdHBpY3R1cmUgPSBgPGltZyBzcmM9XCJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8ke3ZhbC5mcm9tLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48YnI+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7cGljdHVyZX0ke3ZhbC5mcm9tLm5hbWV9PC9hPjwvdGQ+YDtcclxuXHRcdFx0aWYgKChyYXdkYXRhLmNvbW1hbmQgPT0gJ3JlYWN0aW9ucycgfHwgcmF3ZGF0YS5jb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJjZW50ZXJcIj48c3BhbiBjbGFzcz1cInJlYWN0ICR7dmFsLnR5cGV9XCI+PC9zcGFuPiR7dmFsLnR5cGV9PC90ZD5gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3NoYXJlZHBvc3RzJykge1xyXG5cdFx0XHRcdHRkICs9IGA8dGQgY2xhc3M9XCJmb3JjZS1icmVha1wiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuaWR9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHt2YWwuc3Rvcnl9PC9hPjwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIGlmIChyYXdkYXRhLmNvbW1hbmQgPT09ICdyYW5rZXInKSB7XHJcblx0XHRcdFx0dGQgPSBgPHRkPiR7aisxfTwvdGQ+XHJcblx0XHRcdFx0XHQgIDx0ZD48YSBocmVmPSdodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt2YWwuZnJvbS5pZH0nIHRhcmdldD1cIl9ibGFua1wiPiR7dmFsLmZyb20ubmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdCAgPHRkPiR7dmFsLnNjb3JlfTwvdGQ+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgbGluayA9IHZhbC5pZDtcclxuXHRcdFx0XHRpZiAoY29uZmlnLmZyb21fZXh0ZW5zaW9uKSB7XHJcblx0XHRcdFx0XHRsaW5rID0gdmFsLnBvc3RsaW5rO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0ZCArPSBgPHRkIGNsYXNzPVwiZm9yY2UtYnJlYWtcIj48YSBocmVmPVwiJHtob3N0fSR7bGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3ZhbC5tZXNzYWdlfTwvYT48L3RkPlxyXG5cdFx0XHRcdDx0ZD4ke3ZhbC5saWtlX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0PHRkIGNsYXNzPVwibm93cmFwXCI+JHt0aW1lQ29udmVydGVyKHZhbC5jcmVhdGVkX3RpbWUpfTwvdGQ+YDtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgdHIgPSBgPHRyPiR7dGR9PC90cj5gO1xyXG5cdFx0XHR0Ym9keSArPSB0cjtcclxuXHRcdH1cclxuXHRcdGxldCBpbnNlcnQgPSBgPHRoZWFkPjx0ciBhbGlnbj1cImNlbnRlclwiPiR7dGhlYWR9PC90cj48L3RoZWFkPjx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuXHRcdCQoXCIubWFpbl90YWJsZVwiKS5odG1sKCcnKS5hcHBlbmQoaW5zZXJ0KTtcclxuXHJcblxyXG5cdFx0YWN0aXZlKCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gYWN0aXZlKCkge1xyXG5cdFx0XHRUQUJMRSA9ICQoXCIubWFpbl90YWJsZVwiKS5EYXRhVGFibGUoe1xyXG5cdFx0XHRcdFwicGFnZUxlbmd0aFwiOiAxMDAwLFxyXG5cdFx0XHRcdFwic2VhcmNoaW5nXCI6IHRydWUsXHJcblx0XHRcdFx0XCJsZW5ndGhDaGFuZ2VcIjogZmFsc2VcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkKFwiI3NlYXJjaE5hbWVcIikub24oJ2JsdXIgY2hhbmdlIGtleXVwJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFRBQkxFXHJcblx0XHRcdFx0XHQuY29sdW1ucygxKVxyXG5cdFx0XHRcdFx0LnNlYXJjaCh0aGlzLnZhbHVlKVxyXG5cdFx0XHRcdFx0LmRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoXCIjc2VhcmNoQ29tbWVudFwiKS5vbignYmx1ciBjaGFuZ2Uga2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEFCTEVcclxuXHRcdFx0XHRcdC5jb2x1bW5zKDIpXHJcblx0XHRcdFx0XHQuc2VhcmNoKHRoaXMudmFsdWUpXHJcblx0XHRcdFx0XHQuZHJhdygpO1xyXG5cdFx0XHRcdGNvbmZpZy5maWx0ZXIud29yZCA9IHRoaXMudmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVkbzogKCkgPT4ge1xyXG5cdFx0ZGF0YS5maWx0ZXIoZGF0YS5yYXcsIHRydWUpO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGNob29zZSA9IHtcclxuXHRkYXRhOiBbXSxcclxuXHRhd2FyZDogW10sXHJcblx0bnVtOiAwLFxyXG5cdGRldGFpbDogZmFsc2UsXHJcblx0bGlzdDogW10sXHJcblx0aW5pdDogKCkgPT4ge1xyXG5cdFx0bGV0IHRoZWFkID0gJCgnLm1haW5fdGFibGUgdGhlYWQnKS5odG1sKCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRoZWFkJykuaHRtbCh0aGVhZCk7XHJcblx0XHQkKCcjYXdhcmRMaXN0IHRhYmxlIHRib2R5JykuaHRtbCgnJyk7XHJcblx0XHRjaG9vc2UuZGF0YSA9IGRhdGEuZmlsdGVyKGRhdGEucmF3KTtcclxuXHRcdGNob29zZS5hd2FyZCA9IFtdO1xyXG5cdFx0Y2hvb3NlLmxpc3QgPSBbXTtcclxuXHRcdGNob29zZS5udW0gPSAwO1xyXG5cdFx0aWYgKCQoXCIjc2VhcmNoQ29tbWVudFwiKS52YWwoKSAhPSAnJykge1xyXG5cdFx0XHR0YWJsZS5yZWRvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoJChcIiNtb3JlcHJpemVcIikuaGFzQ2xhc3MoXCJhY3RpdmVcIikpIHtcclxuXHRcdFx0Y2hvb3NlLmRldGFpbCA9IHRydWU7XHJcblx0XHRcdCQoXCIucHJpemVEZXRhaWwgLnByaXplXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBuID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0nbnVtYmVyJ11cIikudmFsKCkpO1xyXG5cdFx0XHRcdHZhciBwID0gJCh0aGlzKS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpLnZhbCgpO1xyXG5cdFx0XHRcdGlmIChuID4gMCkge1xyXG5cdFx0XHRcdFx0Y2hvb3NlLm51bSArPSBwYXJzZUludChuKTtcclxuXHRcdFx0XHRcdGNob29zZS5saXN0LnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcIm5hbWVcIjogcCxcclxuXHRcdFx0XHRcdFx0XCJudW1cIjogblxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNob29zZS5udW0gPSAkKFwiI2hvd21hbnlcIikudmFsKCk7XHJcblx0XHR9XHJcblx0XHRjaG9vc2UuZ28oKTtcclxuXHR9LFxyXG5cdGdvOiAoKSA9PiB7XHJcblx0XHRjaG9vc2UuYXdhcmQgPSBnZW5SYW5kb21BcnJheShjaG9vc2UuZGF0YS5maWx0ZXJlZC5sZW5ndGgpLnNwbGljZSgwLCBjaG9vc2UubnVtKTtcclxuXHRcdGxldCBpbnNlcnQgPSAnJztcclxuXHRcdGNob29zZS5hd2FyZC5tYXAoKHZhbCwgaW5kZXgpID0+IHtcclxuXHRcdFx0aW5zZXJ0ICs9ICc8dHIgdGl0bGU9XCLnrKwnICsgKGluZGV4ICsgMSkgKyAn5ZCNXCI+JyArICQoJy5tYWluX3RhYmxlJykuRGF0YVRhYmxlKCkucm93cyh7XHJcblx0XHRcdFx0c2VhcmNoOiAnYXBwbGllZCdcclxuXHRcdFx0fSkubm9kZXMoKVt2YWxdLmlubmVySFRNTCArICc8L3RyPic7XHJcblx0XHR9KVxyXG5cdFx0JCgnI2F3YXJkTGlzdCB0YWJsZSB0Ym9keScpLmh0bWwoaW5zZXJ0KTtcclxuXHRcdCQoJyNhd2FyZExpc3QgdGFibGUgdGJvZHkgdHInKS5hZGRDbGFzcygnc3VjY2VzcycpO1xyXG5cclxuXHRcdGlmIChjaG9vc2UuZGV0YWlsKSB7XHJcblx0XHRcdGxldCBub3cgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBrIGluIGNob29zZS5saXN0KSB7XHJcblx0XHRcdFx0bGV0IHRhciA9ICQoXCIjYXdhcmRMaXN0IHRib2R5IHRyXCIpLmVxKG5vdyk7XHJcblx0XHRcdFx0JChgPHRyPjx0ZCBjbGFzcz1cInByaXplTmFtZVwiIGNvbHNwYW49XCI1XCI+542O5ZOB77yaICR7Y2hvb3NlLmxpc3Rba10ubmFtZX0gPHNwYW4+5YWxICR7Y2hvb3NlLmxpc3Rba10ubnVtfSDlkI08L3NwYW4+PC90ZD48L3RyPmApLmluc2VydEJlZm9yZSh0YXIpO1xyXG5cdFx0XHRcdG5vdyArPSAoY2hvb3NlLmxpc3Rba10ubnVtICsgMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChcIiNtb3JlcHJpemVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcblx0XHRcdCQoXCIuZ2V0dG90YWxcIikucmVtb3ZlQ2xhc3MoXCJmYWRlb3V0XCIpO1xyXG5cdFx0XHQkKCcucHJpemVEZXRhaWwnKS5yZW1vdmVDbGFzcyhcImZhZGVpblwiKTtcclxuXHRcdH1cclxuXHRcdCQoXCIjYXdhcmRMaXN0XCIpLmZhZGVJbigxMDAwKTtcclxuXHR9LFxyXG5cdGdlbl9iaWdfYXdhcmQ6ICgpID0+IHtcclxuXHRcdGxldCBsaSA9ICcnO1xyXG5cdFx0bGV0IGF3YXJkcyA9IFtdO1xyXG5cdFx0JCgnI2F3YXJkTGlzdCB0Ym9keSB0cicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCB2YWwpIHtcclxuXHRcdFx0bGV0IGF3YXJkID0ge307XHJcblx0XHRcdGlmICh2YWwuaGFzQXR0cmlidXRlKCd0aXRsZScpKSB7XHJcblx0XHRcdFx0YXdhcmQuYXdhcmRfbmFtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS5lcSgxKS5maW5kKCdhJykudGV4dCgpO1xyXG5cdFx0XHRcdGF3YXJkLnVzZXJpZCA9ICQodmFsKS5maW5kKCd0ZCcpLmVxKDEpLmZpbmQoJ2EnKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tLycsICcnKTtcclxuXHRcdFx0XHRhd2FyZC5tZXNzYWdlID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLnRleHQoKTtcclxuXHRcdFx0XHRhd2FyZC5saW5rID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoMikuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcclxuXHRcdFx0XHRhd2FyZC50aW1lID0gJCh2YWwpLmZpbmQoJ3RkJykuZXEoJCh2YWwpLmZpbmQoJ3RkJykubGVuZ3RoIC0gMSkudGV4dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGF3YXJkLmF3YXJkX25hbWUgPSB0cnVlO1xyXG5cdFx0XHRcdGF3YXJkLm5hbWUgPSAkKHZhbCkuZmluZCgndGQnKS50ZXh0KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXdhcmRzLnB1c2goYXdhcmQpO1xyXG5cdFx0fSk7XHJcblx0XHRmb3IgKGxldCBpIG9mIGF3YXJkcykge1xyXG5cdFx0XHRpZiAoaS5hd2FyZF9uYW1lID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bGkgKz0gYDxsaSBjbGFzcz1cInByaXplTmFtZVwiPiR7aS5uYW1lfTwvbGk+YDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaSArPSBgPGxpPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj48aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7aS51c2VyaWR9L3BpY3R1cmU/dHlwZT1sYXJnZSZhY2Nlc3NfdG9rZW49JHtjb25maWcucGFnZVRva2VufVwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaW5mb1wiPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibmFtZVwiPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubmFtZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwibWVzc2FnZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kubWVzc2FnZX08L2E+PC9wPlxyXG5cdFx0XHRcdDxwIGNsYXNzPVwidGltZVwiPjxhIGhyZWY9XCIke2kubGlua31cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2kudGltZX08L2E+PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdDwvbGk+YDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLmJpZ19hd2FyZCB1bCcpLmFwcGVuZChsaSk7XHJcblx0XHQkKCcuYmlnX2F3YXJkJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGNsb3NlX2JpZ19hd2FyZDogKCkgPT4ge1xyXG5cdFx0JCgnLmJpZ19hd2FyZCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0XHQkKCcuYmlnX2F3YXJkIHVsJykuZW1wdHkoKTtcclxuXHR9XHJcbn1cclxuXHJcbmxldCBmYmlkID0ge1xyXG5cdGZiaWQ6IFtdLFxyXG5cdGluaXQ6ICh0eXBlKSA9PiB7XHJcblx0XHRmYmlkLmZiaWQgPSBbXTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0RkIuYXBpKFwiL21lXCIsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0ZGF0YS51c2VyaWQgPSByZXMuaWQ7XHJcblx0XHRcdGxldCB1cmwgPSAnJztcclxuXHRcdFx0aWYgKGFkZExpbmspIHtcclxuXHRcdFx0XHR1cmwgPSBmYmlkLmZvcm1hdCgkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgpKTtcclxuXHRcdFx0XHQkKCcubW9yZWxpbmsgLmFkZHVybCcpLnZhbCgnJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dXJsID0gZmJpZC5mb3JtYXQoJCgnI2VudGVyVVJMIC51cmwnKS52YWwoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHVybC5pbmRleE9mKCcucGhwPycpID09PSAtMSAmJiB1cmwuaW5kZXhPZignPycpID4gMCkge1xyXG5cdFx0XHRcdHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoJz8nKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZmJpZC5nZXQodXJsLCB0eXBlKS50aGVuKChmYmlkKSA9PiB7XHJcblx0XHRcdFx0ZGF0YS5zdGFydChmYmlkKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly8gJCgnLmlkZW50aXR5JykucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5odG1sKGDnmbvlhaXouqvku73vvJo8aW1nIHNyYz1cImh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLyR7cmVzLmlkfS9waWN0dXJlP3R5cGU9c21hbGxcIj48c3Bhbj4ke3Jlcy5uYW1lfTwvc3Bhbj5gKTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0Z2V0OiAodXJsLCB0eXBlKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRsZXQgcmVnZXggPSAvXFxkezQsfS9nO1xyXG5cdFx0XHRsZXQgbmV3dXJsID0gdXJsLnN1YnN0cih1cmwuaW5kZXhPZignLycsIDI4KSArIDEsIDIwMCk7XHJcblx0XHRcdC8vIGh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS8g5YWxMjXlrZflhYPvvIzlm6DmraTpgbgyOOmWi+Wni+aJvi9cclxuXHRcdFx0bGV0IHJlc3VsdCA9IG5ld3VybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdGxldCB1cmx0eXBlID0gZmJpZC5jaGVja1R5cGUodXJsKTtcclxuXHRcdFx0ZmJpZC5jaGVja1BhZ2VJRCh1cmwsIHVybHR5cGUpLnRoZW4oKGlkKSA9PiB7XHJcblx0XHRcdFx0aWYgKGlkID09PSAncGVyc29uYWwnKSB7XHJcblx0XHRcdFx0XHR1cmx0eXBlID0gJ3BlcnNvbmFsJztcclxuXHRcdFx0XHRcdGlkID0gZGF0YS51c2VyaWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCBvYmogPSB7XHJcblx0XHRcdFx0XHRwYWdlSUQ6IGlkLFxyXG5cdFx0XHRcdFx0dHlwZTogdXJsdHlwZSxcclxuXHRcdFx0XHRcdGNvbW1hbmQ6IHR5cGUsXHJcblx0XHRcdFx0XHRkYXRhOiBbXVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGFkZExpbmspIG9iai5kYXRhID0gZGF0YS5yYXcuZGF0YTsgLy/ov73liqDosrzmlodcclxuXHRcdFx0XHRpZiAodXJsdHlwZSA9PT0gJ3BlcnNvbmFsJykge1xyXG5cdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ2ZiaWQ9Jyk7XHJcblx0XHRcdFx0XHRpZiAoc3RhcnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0XHRsZXQgZW5kID0gdXJsLmluZGV4T2YoXCImXCIsIHN0YXJ0KTtcclxuXHRcdFx0XHRcdFx0b2JqLnB1cmVJRCA9IHVybC5zdWJzdHJpbmcoc3RhcnQgKyA1LCBlbmQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IHN0YXJ0ID0gdXJsLmluZGV4T2YoJ3Bvc3RzLycpO1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gdXJsLnN1YnN0cmluZyhzdGFydCArIDYsIHVybC5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bGV0IHZpZGVvID0gdXJsLmluZGV4T2YoJ3ZpZGVvcy8nKTtcclxuXHRcdFx0XHRcdGlmICh2aWRlbyA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbMF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh1cmx0eXBlID09PSAncHVyZScpIHtcclxuXHRcdFx0XHRcdG9iai5mdWxsSUQgPSB1cmwucmVwbGFjZSgvXFxcIi9nLCAnJyk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICh1cmx0eXBlID09PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFswXTtcclxuXHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyBcIl9cIiArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHVybHR5cGUgPT09ICdwaG90bycpIHtcclxuXHRcdFx0XHRcdFx0bGV0IHJlZ2V4ID0gL1xcZHs0LH0vZztcclxuXHRcdFx0XHRcdFx0bGV0IHJlc3VsdCA9IHVybC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsdHlwZSA9PT0gJ3ZpZGVvJykge1xyXG5cdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucHVyZUlEfT9maWVsZHM9bGl2ZV9zdGF0dXNgLCBmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5saXZlX3N0YXR1cyA9PT0gJ0xJVkUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLmZ1bGxJRCA9IG9iai5wYWdlSUQgKyAnXycgKyBvYmoucHVyZUlEO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT0gMSB8fCByZXN1bHQubGVuZ3RoID09IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdG9iai5mdWxsSUQgPSBvYmoucGFnZUlEICsgJ18nICsgb2JqLnB1cmVJRDtcclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHVybHR5cGUgPT09ICd1bm5hbWUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvYmoucHVyZUlEID0gcmVzdWx0WzBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0b2JqLnBhZ2VJRCA9IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdG9iai5wdXJlSUQgPSByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRvYmouZnVsbElEID0gb2JqLnBhZ2VJRCArICdfJyArIG9iai5wdXJlSUQ7XHJcblx0XHRcdFx0XHRcdFx0RkIuYXBpKGAvJHtvYmoucGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHJlcy5lcnJvcikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKG9iaik7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUob2JqKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGNoZWNrVHlwZTogKHBvc3R1cmwpID0+IHtcclxuXHRcdGlmIChwb3N0dXJsLmluZGV4T2YoXCJmYmlkPVwiKSA+PSAwKSB7XHJcblx0XHRcdGlmIChwb3N0dXJsLmluZGV4T2YoJ3Blcm1hbGluaycpID49IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3VubmFtZSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICdwZXJzb25hbCc7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiL2dyb3Vwcy9cIikgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gJ2dyb3VwJztcclxuXHRcdH07XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKFwiZXZlbnRzXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdldmVudCc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi9waG90b3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwaG90byc7XHJcblx0XHR9O1xyXG5cdFx0aWYgKHBvc3R1cmwuaW5kZXhPZihcIi92aWRlb3MvXCIpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICd2aWRlbyc7XHJcblx0XHR9XHJcblx0XHRpZiAocG9zdHVybC5pbmRleE9mKCdcIicpID49IDApIHtcclxuXHRcdFx0cmV0dXJuICdwdXJlJztcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gJ25vcm1hbCc7XHJcblx0fSxcclxuXHRjaGVja1BhZ2VJRDogKHBvc3R1cmwsIHR5cGUpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBzdGFydCA9IHBvc3R1cmwuaW5kZXhPZihcImZhY2Vib29rLmNvbVwiKSArIDEzO1xyXG5cdFx0XHRsZXQgZW5kID0gcG9zdHVybC5pbmRleE9mKFwiL1wiLCBzdGFydCk7XHJcblx0XHRcdGxldCByZWdleCA9IC9cXGR7NCx9L2c7XHJcblx0XHRcdGlmIChlbmQgPCAwKSB7XHJcblx0XHRcdFx0aWYgKHBvc3R1cmwuaW5kZXhPZignZmJpZD0nKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gJ3VubmFtZScpIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZSgndW5uYW1lJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdwZXJzb25hbCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHBvc3R1cmwubWF0Y2gocmVnZXgpWzFdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGV0IGdyb3VwID0gcG9zdHVybC5pbmRleE9mKCcvZ3JvdXBzLycpO1xyXG5cdFx0XHRcdGxldCBldmVudCA9IHBvc3R1cmwuaW5kZXhPZignL2V2ZW50cy8nKVxyXG5cdFx0XHRcdGlmIChncm91cCA+PSAwKSB7XHJcblx0XHRcdFx0XHRzdGFydCA9IGdyb3VwICsgODtcclxuXHRcdFx0XHRcdGVuZCA9IHBvc3R1cmwuaW5kZXhPZihcIi9cIiwgc3RhcnQpO1xyXG5cdFx0XHRcdFx0bGV0IHJlZ2V4MiA9IC9cXGR7Nix9L2c7XHJcblx0XHRcdFx0XHRsZXQgdGVtcCA9IHBvc3R1cmwuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpO1xyXG5cdFx0XHRcdFx0aWYgKHJlZ2V4Mi50ZXN0KHRlbXApKSB7XHJcblx0XHRcdFx0XHRcdHJlc29sdmUodGVtcCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKCdncm91cCcpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZlbnQgPj0gMCkge1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSgnZXZlbnQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHBhZ2VuYW1lID0gcG9zdHVybC5zdWJzdHJpbmcoc3RhcnQsIGVuZCk7XHJcblx0XHRcdFx0XHRGQi5hcGkoYC8ke3BhZ2VuYW1lfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRcdFx0XHRpZiAocmVzLmVycm9yKSB7XHJcblx0XHRcdFx0XHRcdFx0ZmJlcnJvciA9IHJlcy5lcnJvci5tZXNzYWdlO1xyXG5cdFx0XHRcdFx0XHRcdHJlc29sdmUoJ3BlcnNvbmFsJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHJlcy5hY2Nlc3NfdG9rZW4pIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXNvbHZlKHJlcy5pZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRmb3JtYXQ6ICh1cmwpID0+IHtcclxuXHRcdGlmICh1cmwuaW5kZXhPZignYnVzaW5lc3MuZmFjZWJvb2suY29tLycpID49IDApIHtcclxuXHRcdFx0dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpO1xyXG5cdFx0XHRyZXR1cm4gdXJsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVybDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmxldCBmaWx0ZXIgPSB7XHJcblx0dG90YWxGaWx0ZXI6IChyYXdkYXRhLCBpc0R1cGxpY2F0ZSwgaXNUYWcsIHdvcmQsIHJlYWN0LCBzdGFydFRpbWUsIGVuZFRpbWUpID0+IHtcclxuXHRcdGxldCBkYXRhID0gcmF3ZGF0YS5kYXRhO1xyXG5cdFx0aWYgKHdvcmQgIT09ICcnKSB7XHJcblx0XHRcdGRhdGEgPSBmaWx0ZXIud29yZChkYXRhLCB3b3JkKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc1RhZykge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRhZyhkYXRhKTtcclxuXHRcdH1cclxuXHRcdGlmICgocmF3ZGF0YS5jb21tYW5kID09ICdyZWFjdGlvbnMnIHx8IHJhd2RhdGEuY29tbWFuZCA9PSAnbGlrZXMnKSB8fCBjb25maWcubGlrZXMpIHtcclxuXHRcdFx0ZGF0YSA9IGZpbHRlci5yZWFjdChkYXRhLCByZWFjdCk7XHJcblx0XHR9IGVsc2UgaWYgKHJhd2RhdGEuY29tbWFuZCA9PT0gJ3JhbmtlcicpIHtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnRpbWUoZGF0YSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0R1cGxpY2F0ZSkge1xyXG5cdFx0XHRkYXRhID0gZmlsdGVyLnVuaXF1ZShkYXRhKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGF0YTtcclxuXHR9LFxyXG5cdHVuaXF1ZTogKGRhdGEpID0+IHtcclxuXHRcdGxldCBvdXRwdXQgPSBbXTtcclxuXHRcdGxldCBrZXlzID0gW107XHJcblx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0bGV0IGtleSA9IGl0ZW0uZnJvbS5pZDtcclxuXHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHRcdG91dHB1dC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fSxcclxuXHR3b3JkOiAoZGF0YSwgd29yZCkgPT4ge1xyXG5cdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRpZiAobi5tZXNzYWdlID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpZiAobi5zdG9yeS5pbmRleE9mKHdvcmQpID4gLTEpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAobi5tZXNzYWdlLmluZGV4T2Yod29yZCkgPiAtMSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0YWc6IChkYXRhKSA9PiB7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGlmIChuLm1lc3NhZ2VfdGFncykge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBuZXdBcnk7XHJcblx0fSxcclxuXHR0aW1lOiAoZGF0YSwgc3QsIHQpID0+IHtcclxuXHRcdGxldCB0aW1lX2FyeTIgPSBzdC5zcGxpdChcIi1cIik7XHJcblx0XHRsZXQgdGltZV9hcnkgPSB0LnNwbGl0KFwiLVwiKTtcclxuXHRcdGxldCBlbmR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5WzBdLCAocGFyc2VJbnQodGltZV9hcnlbMV0pIC0gMSksIHRpbWVfYXJ5WzJdLCB0aW1lX2FyeVszXSwgdGltZV9hcnlbNF0sIHRpbWVfYXJ5WzVdKSkuX2Q7XHJcblx0XHRsZXQgc3RhcnR0aW1lID0gbW9tZW50KG5ldyBEYXRlKHRpbWVfYXJ5MlswXSwgKHBhcnNlSW50KHRpbWVfYXJ5MlsxXSkgLSAxKSwgdGltZV9hcnkyWzJdLCB0aW1lX2FyeTJbM10sIHRpbWVfYXJ5Mls0XSwgdGltZV9hcnkyWzVdKSkuX2Q7XHJcblx0XHRsZXQgbmV3QXJ5ID0gJC5ncmVwKGRhdGEsIGZ1bmN0aW9uIChuLCBpKSB7XHJcblx0XHRcdGxldCBjcmVhdGVkX3RpbWUgPSBtb21lbnQobi5jcmVhdGVkX3RpbWUpLl9kO1xyXG5cdFx0XHRpZiAoKGNyZWF0ZWRfdGltZSA+IHN0YXJ0dGltZSAmJiBjcmVhdGVkX3RpbWUgPCBlbmR0aW1lKSB8fCBuLmNyZWF0ZWRfdGltZSA9PSBcIlwiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIG5ld0FyeTtcclxuXHR9LFxyXG5cdHJlYWN0OiAoZGF0YSwgdGFyKSA9PiB7XHJcblx0XHRpZiAodGFyID09ICdhbGwnKSB7XHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGV0IG5ld0FyeSA9ICQuZ3JlcChkYXRhLCBmdW5jdGlvbiAobiwgaSkge1xyXG5cdFx0XHRcdGlmIChuLnR5cGUgPT0gdGFyKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJ5O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxubGV0IHVpID0ge1xyXG5cdGluaXQ6ICgpID0+IHtcclxuXHJcblx0fSxcclxuXHRhZGRMaW5rOiAoKSA9PiB7XHJcblx0XHRsZXQgdGFyID0gJCgnLmlucHV0YXJlYSAubW9yZWxpbmsnKTtcclxuXHRcdGlmICh0YXIuaGFzQ2xhc3MoJ3Nob3cnKSkge1xyXG5cdFx0XHR0YXIucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhci5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVzZXQ6ICgpID0+IHtcclxuXHRcdGxldCBjb21tYW5kID0gZGF0YS5yYXcuY29tbWFuZDtcclxuXHRcdGlmICgoY29tbWFuZCA9PSAncmVhY3Rpb25zJyB8fCBjb21tYW5kID09ICdsaWtlcycpIHx8IGNvbmZpZy5saWtlcykge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKCcubGltaXRUaW1lLCAjc2VhcmNoQ29tbWVudCcpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdCQoJy51aXBhbmVsIC5yZWFjdCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoY29tbWFuZCA9PT0gJ2NvbW1lbnRzJykge1xyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCQoXCIjdGFnXCIpLnByb3AoXCJjaGVja2VkXCIpKSB7XHJcblx0XHRcdFx0JChcIiN0YWdcIikuY2xpY2soKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQkKCdsYWJlbC50YWcnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5sZXQgcGFnZV9zZWxlY3RvciA9IHtcclxuXHRwYWdlczogW10sXHJcblx0Z3JvdXBzOiBbXSxcclxuXHRzaG93OiAoKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0cGFnZV9zZWxlY3Rvci5nZXRBZG1pbigpO1xyXG5cdH0sXHJcblx0Z2V0QWRtaW46ICgpPT57XHJcblx0XHRQcm9taXNlLmFsbChbcGFnZV9zZWxlY3Rvci5nZXRQYWdlKCksIHBhZ2Vfc2VsZWN0b3IuZ2V0R3JvdXAoKV0pLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0cGFnZV9zZWxlY3Rvci5nZW5BZG1pbihyZXMpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKT0+e1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lL2FjY291bnRzP2xpbWl0PTEwMGAsIChyZXMpPT57XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCk9PntcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9ncm91cHM/ZmllbGRzPW5hbWUsaWQsYWRtaW5pc3RyYXRvciZsaW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRcdHJlc29sdmUgKHJlcy5kYXRhLmZpbHRlcihpdGVtPT57cmV0dXJuIGl0ZW0uYWRtaW5pc3RyYXRvciA9PT0gdHJ1ZX0pKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbkFkbWluOiAocmVzKT0+e1xyXG5cdFx0bGV0IHBhZ2VzID0gJyc7XHJcblx0XHRsZXQgZ3JvdXBzID0gJyc7XHJcblx0XHRmb3IobGV0IGkgb2YgcmVzWzBdKXtcclxuXHRcdFx0cGFnZXMgKz0gYDxkaXYgY2xhc3M9XCJwYWdlX2J0blwiIGRhdGEtdHlwZT1cIjFcIiBkYXRhLXZhbHVlPVwiJHtpLmlkfVwiIG9uY2xpY2s9XCJwYWdlX3NlbGVjdG9yLnNlbGVjdFBhZ2UodGhpcylcIj4ke2kubmFtZX08L2Rpdj5gO1xyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpIG9mIHJlc1sxXSl7XHJcblx0XHRcdGdyb3VwcyArPSBgPGRpdiBjbGFzcz1cInBhZ2VfYnRuXCIgZGF0YS10eXBlPVwiMlwiIGRhdGEtdmFsdWU9XCIke2kuaWR9XCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UGFnZSh0aGlzKVwiPiR7aS5uYW1lfTwvZGl2PmA7XHJcblx0XHR9XHJcblx0XHQkKCcuc2VsZWN0X3BhZ2UnKS5odG1sKHBhZ2VzKTtcclxuXHRcdCQoJy5zZWxlY3RfZ3JvdXAnKS5odG1sKGdyb3Vwcyk7XHJcblx0fSxcclxuXHRzZWxlY3RQYWdlOiAodGFyZ2V0KT0+e1xyXG5cdFx0bGV0IHBhZ2VfaWQgPSAkKHRhcmdldCkuZGF0YSgndmFsdWUnKTtcclxuXHRcdGlmICgkKHRhcmdldCkuZGF0YSgndHlwZScpID09ICcxJyl7XHJcblx0XHRcdEZCLmFwaShgLyR7cGFnZV9pZH0/ZmllbGRzPWFjY2Vzc190b2tlbmAsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IHJlcy5hY2Nlc3NfdG9rZW47XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRjb25maWcucGFnZVRva2VuID0gJyc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9LyR7cGFnZV9pZH0vZmVlZD9saW1pdD0xMDBgLCAocmVzKT0+e1xyXG5cdFx0XHRsZXQgdGJvZHkgPSAnJztcclxuXHRcdFx0Zm9yKGxldCB0ciBvZiByZXMuZGF0YSl7XHJcblx0XHRcdFx0dGJvZHkgKz0gYDx0cj48dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInBhZ2Vfc2VsZWN0b3Iuc2VsZWN0UG9zdCgnJHt0ci5pZH0nKVwiPumBuOaTh+iyvOaWhzwvYnV0dG9uPjwvdGQ+PHRkPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vJHt0ci5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke3RyLm1lc3NhZ2V9PC9hPjwvdGQ+PHRkPiR7dGltZUNvbnZlcnRlcih0ci5jcmVhdGVkX3RpbWUpfTwvdGQ+PC90cj5gO1xyXG5cdFx0XHR9XHJcblx0XHRcdCQoJyNwb3N0X3RhYmxlIHRib2R5JykuaHRtbCh0Ym9keSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHNlbGVjdFBvc3Q6IChmYmlkKT0+e1xyXG5cdFx0JCgnLnBhZ2Vfc2VsZWN0b3InKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0JCgnLnNlbGVjdF9wYWdlJykuaHRtbCgnJyk7XHJcblx0XHQkKCcuc2VsZWN0X2dyb3VwJykuaHRtbCgnJyk7XHJcblx0XHQkKCcjcG9zdF90YWJsZSB0Ym9keScpLmh0bWwoJycpO1xyXG5cdFx0bGV0IGlkID0gJ1wiJytmYmlkKydcIic7XHJcblx0XHQkKCcjZW50ZXJVUkwgLnVybCcpLnZhbChpZCk7XHJcblx0fVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbm93RGF0ZSgpIHtcclxuXHR2YXIgYSA9IG5ldyBEYXRlKCk7XHJcblx0dmFyIHllYXIgPSBhLmdldEZ1bGxZZWFyKCk7XHJcblx0dmFyIG1vbnRoID0gYS5nZXRNb250aCgpICsgMTtcclxuXHR2YXIgZGF0ZSA9IGEuZ2V0RGF0ZSgpO1xyXG5cdHZhciBob3VyID0gYS5nZXRIb3VycygpO1xyXG5cdHZhciBtaW4gPSBhLmdldE1pbnV0ZXMoKTtcclxuXHR2YXIgc2VjID0gYS5nZXRTZWNvbmRzKCk7XHJcblx0cmV0dXJuIHllYXIgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyBkYXRlICsgXCItXCIgKyBob3VyICsgXCItXCIgKyBtaW4gKyBcIi1cIiArIHNlYztcclxufVxyXG5cclxuZnVuY3Rpb24gdGltZUNvbnZlcnRlcihVTklYX3RpbWVzdGFtcCkge1xyXG5cdHZhciBhID0gbW9tZW50KFVOSVhfdGltZXN0YW1wKS5fZDtcclxuXHR2YXIgbW9udGhzID0gWycwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcxMCcsICcxMScsICcxMiddO1xyXG5cdHZhciB5ZWFyID0gYS5nZXRGdWxsWWVhcigpO1xyXG5cdHZhciBtb250aCA9IG1vbnRoc1thLmdldE1vbnRoKCldO1xyXG5cdHZhciBkYXRlID0gYS5nZXREYXRlKCk7XHJcblx0aWYgKGRhdGUgPCAxMCkge1xyXG5cdFx0ZGF0ZSA9IFwiMFwiICsgZGF0ZTtcclxuXHR9XHJcblx0dmFyIGhvdXIgPSBhLmdldEhvdXJzKCk7XHJcblx0dmFyIG1pbiA9IGEuZ2V0TWludXRlcygpO1xyXG5cdGlmIChtaW4gPCAxMCkge1xyXG5cdFx0bWluID0gXCIwXCIgKyBtaW47XHJcblx0fVxyXG5cdHZhciBzZWMgPSBhLmdldFNlY29uZHMoKTtcclxuXHRpZiAoc2VjIDwgMTApIHtcclxuXHRcdHNlYyA9IFwiMFwiICsgc2VjO1xyXG5cdH1cclxuXHR2YXIgdGltZSA9IHllYXIgKyAnLScgKyBtb250aCArICctJyArIGRhdGUgKyBcIiBcIiArIGhvdXIgKyAnOicgKyBtaW4gKyAnOicgKyBzZWM7XHJcblx0cmV0dXJuIHRpbWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9iajJBcnJheShvYmopIHtcclxuXHRsZXQgYXJyYXkgPSAkLm1hcChvYmosIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcclxuXHRcdHJldHVybiBbdmFsdWVdO1xyXG5cdH0pO1xyXG5cdHJldHVybiBhcnJheTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuUmFuZG9tQXJyYXkobikge1xyXG5cdHZhciBhcnkgPSBuZXcgQXJyYXkoKTtcclxuXHR2YXIgaSwgciwgdDtcclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRhcnlbaV0gPSBpO1xyXG5cdH1cclxuXHRmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XHJcblx0XHRyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbik7XHJcblx0XHR0ID0gYXJ5W3JdO1xyXG5cdFx0YXJ5W3JdID0gYXJ5W2ldO1xyXG5cdFx0YXJ5W2ldID0gdDtcclxuXHR9XHJcblx0cmV0dXJuIGFyeTtcclxufVxyXG5cclxuZnVuY3Rpb24gSlNPTlRvQ1NWQ29udmVydG9yKEpTT05EYXRhLCBSZXBvcnRUaXRsZSwgU2hvd0xhYmVsKSB7XHJcblx0Ly9JZiBKU09ORGF0YSBpcyBub3QgYW4gb2JqZWN0IHRoZW4gSlNPTi5wYXJzZSB3aWxsIHBhcnNlIHRoZSBKU09OIHN0cmluZyBpbiBhbiBPYmplY3RcclxuXHR2YXIgYXJyRGF0YSA9IHR5cGVvZiBKU09ORGF0YSAhPSAnb2JqZWN0JyA/IEpTT04ucGFyc2UoSlNPTkRhdGEpIDogSlNPTkRhdGE7XHJcblxyXG5cdHZhciBDU1YgPSAnJztcclxuXHQvL1NldCBSZXBvcnQgdGl0bGUgaW4gZmlyc3Qgcm93IG9yIGxpbmVcclxuXHJcblx0Ly8gQ1NWICs9IFJlcG9ydFRpdGxlICsgJ1xcclxcblxcbic7XHJcblxyXG5cdC8vVGhpcyBjb25kaXRpb24gd2lsbCBnZW5lcmF0ZSB0aGUgTGFiZWwvSGVhZGVyXHJcblx0aWYgKFNob3dMYWJlbCkge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly9UaGlzIGxvb3Agd2lsbCBleHRyYWN0IHRoZSBsYWJlbCBmcm9tIDFzdCBpbmRleCBvZiBvbiBhcnJheVxyXG5cdFx0Zm9yICh2YXIgaW5kZXggaW4gYXJyRGF0YVswXSkge1xyXG5cclxuXHRcdFx0Ly9Ob3cgY29udmVydCBlYWNoIHZhbHVlIHRvIHN0cmluZyBhbmQgY29tbWEtc2VwcmF0ZWRcclxuXHRcdFx0cm93ICs9IGluZGV4ICsgJywnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdyA9IHJvdy5zbGljZSgwLCAtMSk7XHJcblxyXG5cdFx0Ly9hcHBlbmQgTGFiZWwgcm93IHdpdGggbGluZSBicmVha1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0Ly8xc3QgbG9vcCBpcyB0byBleHRyYWN0IGVhY2ggcm93XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJEYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgcm93ID0gXCJcIjtcclxuXHJcblx0XHQvLzJuZCBsb29wIHdpbGwgZXh0cmFjdCBlYWNoIGNvbHVtbiBhbmQgY29udmVydCBpdCBpbiBzdHJpbmcgY29tbWEtc2VwcmF0ZWRcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbaV0pIHtcclxuXHRcdFx0cm93ICs9ICdcIicgKyBhcnJEYXRhW2ldW2luZGV4XSArICdcIiwnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJvdy5zbGljZSgwLCByb3cubGVuZ3RoIC0gMSk7XHJcblxyXG5cdFx0Ly9hZGQgYSBsaW5lIGJyZWFrIGFmdGVyIGVhY2ggcm93XHJcblx0XHRDU1YgKz0gcm93ICsgJ1xcclxcbic7XHJcblx0fVxyXG5cclxuXHRpZiAoQ1NWID09ICcnKSB7XHJcblx0XHRhbGVydChcIkludmFsaWQgZGF0YVwiKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdC8vR2VuZXJhdGUgYSBmaWxlIG5hbWVcclxuXHR2YXIgZmlsZU5hbWUgPSBcIlwiO1xyXG5cdC8vdGhpcyB3aWxsIHJlbW92ZSB0aGUgYmxhbmstc3BhY2VzIGZyb20gdGhlIHRpdGxlIGFuZCByZXBsYWNlIGl0IHdpdGggYW4gdW5kZXJzY29yZVxyXG5cdGZpbGVOYW1lICs9IFJlcG9ydFRpdGxlLnJlcGxhY2UoLyAvZywgXCJfXCIpO1xyXG5cclxuXHQvL0luaXRpYWxpemUgZmlsZSBmb3JtYXQgeW91IHdhbnQgY3N2IG9yIHhsc1xyXG5cdHZhciB1cmkgPSAnZGF0YTp0ZXh0L2NzdjtjaGFyc2V0PXV0Zi04LFxcdUZFRkYnICsgZW5jb2RlVVJJKENTVik7XHJcblxyXG5cdC8vIE5vdyB0aGUgbGl0dGxlIHRyaWNreSBwYXJ0LlxyXG5cdC8vIHlvdSBjYW4gdXNlIGVpdGhlcj4+IHdpbmRvdy5vcGVuKHVyaSk7XHJcblx0Ly8gYnV0IHRoaXMgd2lsbCBub3Qgd29yayBpbiBzb21lIGJyb3dzZXJzXHJcblx0Ly8gb3IgeW91IHdpbGwgbm90IGdldCB0aGUgY29ycmVjdCBmaWxlIGV4dGVuc2lvbiAgICBcclxuXHJcblx0Ly90aGlzIHRyaWNrIHdpbGwgZ2VuZXJhdGUgYSB0ZW1wIDxhIC8+IHRhZ1xyXG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcblx0bGluay5ocmVmID0gdXJpO1xyXG5cclxuXHQvL3NldCB0aGUgdmlzaWJpbGl0eSBoaWRkZW4gc28gaXQgd2lsbCBub3QgZWZmZWN0IG9uIHlvdXIgd2ViLWxheW91dFxyXG5cdGxpbmsuc3R5bGUgPSBcInZpc2liaWxpdHk6aGlkZGVuXCI7XHJcblx0bGluay5kb3dubG9hZCA9IGZpbGVOYW1lICsgXCIuY3N2XCI7XHJcblxyXG5cdC8vdGhpcyBwYXJ0IHdpbGwgYXBwZW5kIHRoZSBhbmNob3IgdGFnIGFuZCByZW1vdmUgaXQgYWZ0ZXIgYXV0b21hdGljIGNsaWNrXHJcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcclxuXHRsaW5rLmNsaWNrKCk7XHJcblx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcclxufSJdfQ==
