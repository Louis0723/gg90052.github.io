"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var errorMessage = false;
window.onerror = handleErr;

function handleErr(msg, url, l) {
	if (!errorMessage) {
		console.log("%c發生錯誤，請將完整錯誤訊息截圖傳送給管理員，並附上你輸入的網址", "font-size:30px; color:#F00");
		$(".console .error").fadeIn();
		errorMessage = true;
	}
	return false;
}

var config = {
	field: {
		comments: ['from', 'like_count', 'comment_count', 'reactions', 'is_hidden', 'message', 'message_tags'],
		reactions: [],
		sharedposts: ['story', 'from', 'created_time'],
		url_comments: [],
		feed: []
	},
	limit: {
		comments: '500',
		reactions: '500',
		sharedposts: '500',
		url_comments: '500',
		feed: '500'
	},
	apiVersion: {
		comments: 'v3.1',
		reactions: 'v3.1',
		feed: 'v3.1',
		group: 'v3.1',
		newest: 'v2.8'
	},
	auth: 'manage_pages,groups_access_member_info',
	extension: false,
	pageToken: ''
};

var fb = {
	next: '',
	feeds: [],
	getAuth: function getAuth(type) {
		FB.login(function (response) {
			fb.callback(response, type);
		}, {
			scope: config.auth,
			return_scopes: true
		});
	},
	callback: function callback(response, type) {
		if (response.status === 'connected') {
			console.log(response);
			if (type == "addScope") {
				var authStr = response.authResponse.grantedScopes;
				if (authStr.indexOf('user_posts') >= 0) {
					fb.start();
				} else {
					swal('授權失敗，請給予所有權限', 'Authorization Failed! Please contact the admin.', 'error').done();
				}
			} else {
				fbid.init(type);
			}
		} else {
			FB.login(function (response) {
				fb.callback(response, type);
			}, {
				scope: config.auth,
				return_scopes: true
			});
		}
	},
	start: function start() {
		Promise.all([fb.getPage(), fb.getGroup()]).then(function (res) {
			sessionStorage.login = JSON.stringify(res);
			fb.genOption(res);
		});
	},
	genOption: function genOption(res) {
		fb.next = '';
		var options = '';
		var type = -1;
		$('aside').addClass('login');
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var i = _step.value;

				type++;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = i[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var j = _step2.value;

						options += "<option attr-type=\"" + type + "\" value=\"" + j.id + "\">" + j.name + "</option>";
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

		$('aside .step1 select').append(options);
		$('aside select').select2();
		// $('aside select').on('change', function (event) {
		// 	let type = $(this).find('option:selected').attr('attr-type');
		// 	fb.selectPage(event.target.value, type);
		// });
	},
	selectPage: function selectPage() {
		fb.next = '';
		var tar = $('aside select');
		var type = tar.find('option:selected').attr('attr-type');
		if (type == 1) {
			fb.setToken(tar.find('option:selected').attr('value'));
		}
		fb.feed(tar.val(), type, fb.next);
	},
	setToken: function setToken(pageid) {
		var pages = JSON.parse(sessionStorage.login)[1];
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = pages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var i = _step3.value;

				if (i.id == pageid) {
					config.pageToken = i.access_token;
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
	},
	feed: function feed(pageID, type) {
		var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
		var clear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		$('button.start').addClass('disabled').text('Loading...');
		var command = 'feed';
		var api = void 0;
		var start = Math.floor(Date.parse($('#start_date').pickadate('picker').get('select', 'yyyy-mm-dd')) / 1000);
		var end = Math.floor(Date.parse($('#end_date').pickadate('picker').get('select', 'yyyy-mm-dd')) / 1000);
		//1468466990097623
		if (url == '') {
			api = pageID + "/" + command + "?since=" + start + "&until=" + end + "&fields=link,full_picture,created_time,message&limit=100";
		} else {
			api = url;
		}
		FB.api("/" + pageID + "?fields=access_token", function (res) {
			if (res.access_token) {
				config.pageToken = res.access_token;
			}
		});
		FB.api(api, function (res) {
			console.log(res);
			console.log(api);
			if (res.data.length > 0) {
				fb.feeds = res.data;
				if (res.paging) {
					next(res.paging.next);
				} else {
					data.start();
				}
			} else {
				alert('沒有資料');
				$('button.start').removeClass('disabled').text('開始');
			}
		});

		function next(url) {
			if (url) {
				$.get(url, function (res) {
					if (res.data.length > 0) {
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = res.data[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var i = _step4.value;

								fb.feeds.push(i);
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

						if (res.paging) {
							next(res.paging.next);
						} else {
							data.start();
						}
					} else {
						data.start();
					}
				});
			} else {
				data.start();
			}
		}
	},
	getMe: function getMe() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me", function (res) {
				var arr = [res];
				resolve(arr);
			});
		});
	},
	getPage: function getPage() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/accounts?limit=100", function (res) {
				resolve(res.data);
			});
		});
	},
	getGroup: function getGroup() {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/me/groups?limit=100&fields=administrator,name", function (res) {
				var groups = [];
				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = res.data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var i = _step5.value;

						if (i.administrator) groups.push(i);
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

				resolve(groups);
			});
		});
	},
	getName: function getName(ids) {
		return new Promise(function (resolve, reject) {
			FB.api(config.apiVersion.newest + "/?ids=" + ids.toString(), function (res) {
				resolve(res);
			});
		});
	}
};

var data = {
	userid: '',
	nowLength: 0,
	extension: false,
	promise_array: [],
	finalArray: [],
	dateRange: {},
	init: function init() {
		$(".console .message").text('');
		data.nowLength = 0;
		data.promise_array = [];
		data.raw = [];
	},
	dateCheck: function dateCheck() {
		var start = $('#start_date').pickadate('picker').get('select', 'yyyy-mm-dd');
		var end = $('#end_date').pickadate('picker').get('select', 'yyyy-mm-dd');
		var message = '';
		if (start == '' || end == '') {
			message = '請選擇日期';
		} else {
			var d1 = new Date($('#start_date').pickadate('picker').get('select').pick);
			var d2 = new Date($('#end_date').pickadate('picker').get('select').pick);
			if (d2 - d1 > 5184000000) {
				message = '日期區間不能超過60天';
				// let temp = start;
				// start = end;
				// end = temp;
			} else if (d2 < d1) {
				var temp = start;
				start = end;
				end = temp;
			}
		}
		if (message == '') {
			return {
				'check': true,
				'range': "since=" + start + "&until=" + end,
				'string': $('#start_date').pickadate('picker').get('select', 'yyyy/mm/dd') + " ~ " + $('#end_date').pickadate('picker').get('select', 'yyyy/mm/dd')
			};
		} else {
			return {
				'check': false,
				'message': message
			};
		}
	},
	start: function start() {
		$('button.start').removeClass('disabled').text('開始');
		data.init();
		var range = data.dateCheck();
		if (range.check === true) {
			(function () {
				data.dateRange = range;
				var all = [];
				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					var _loop = function _loop() {
						var j = _step6.value;

						var obj = {
							fullID: j.id,
							obj: {}
						};
						var promise = data.get(obj).then(function (res) {
							obj.data = res;
							all.push(obj);
						});
						data.promise_array.push(promise);
					};

					for (var _iterator6 = fb.feeds[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						_loop();
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

				$('.loading').addClass('show');
				Promise.all(data.promise_array).then(function (res) {
					data.count_score(all);
				});
			})();
		} else {
			alert(range.message);
		}
	},
	get: function get(fbid) {
		return new Promise(function (resolve, reject) {
			var datas = [];
			var promise_array = [];
			var command = 'comments';
			var token = config.pageToken ? '&access_token=' + config.pageToken : '';
			FB.api(config.apiVersion[command] + "/" + fbid.fullID + "/comments?" + data.dateRange.range + "&order=chronological&fields=" + config.field[command].toString() + token, function (res) {
				if (res.data) {
					data.nowLength += res.data.length;
					$(".console .message").text('已截取  ' + data.nowLength + ' 筆資料...');
					// console.log(res);
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = res.data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var d = _step7.value;

							if (!d.is_hidden) {
								d.cid = d.from.id + '_' + d.id.substr(0, d.id.indexOf('_'));
								datas.push(d);
							}
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

					if (res.data.length > 0 && res.paging.next) {
						getNext(res.paging.next);
					} else {
						resolve(datas);
					}
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
					var _iteratorNormalCompletion8 = true;
					var _didIteratorError8 = false;
					var _iteratorError8 = undefined;

					try {
						for (var _iterator8 = res.data[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
							var d = _step8.value;

							datas.push(d);
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

					if (res.data.length > 0 && res.paging.next) {
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
	count_score: function count_score(all) {
		/*
  	留言3分、TAG一個1分，最多3分
  	留言心情2個1分，無條件進位，最多13分
  	留言的留言一個1分，最大6分
  */
		var score_array = [];
		var _iteratorNormalCompletion9 = true;
		var _didIteratorError9 = false;
		var _iteratorError9 = undefined;

		try {
			for (var _iterator9 = all[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
				var i = _step9.value;

				var arr = i.data;
				var score_rule = {
					'comments': 1,
					'comments_max': 6,
					'reactions': 0.5,
					'reactions_max': 13,
					'tag': 1,
					'tag_max': 3
				};
				var score = void 0;
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = arr[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var j = _step11.value;

						score = 3;
						score += j.comment_count * score_rule.comments > score_rule.comments_max ? score_rule.comments_max : j.comment_count * score_rule.comments;
						var user = {
							'id': j.id,
							'userid': j.from.id,
							'username': j.from.name,
							'comment_count': j.comment_count,
							'message': j.message,
							'cid': j.cid
						};
						if (j.reactions) {
							if (j.reactions.data.length === 25) {
								user.like_count = j.like_count;
								score += score_rule.reactions_max;
							} else {
								user.like_count = j.reactions.data.length;
								score += Math.ceil(j.reactions.data.length * score_rule.reactions);
							}
						} else {
							user.like_count = 0;
						}
						if (j.message_tags) {
							user.tag_count = j.message_tags.length;
							score += j.message_tags.length * score_rule.tag >= score_rule.tag_max ? score_rule.tag_max : j.message_tags.length * score_rule.tag;
						} else {
							user.tag_count = 0;
						}
						user.score = score;
						score_array.push(user);
					}
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}
			}
			// console.log(score_array);
		} catch (err) {
			_didIteratorError9 = true;
			_iteratorError9 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion9 && _iterator9.return) {
					_iterator9.return();
				}
			} finally {
				if (_didIteratorError9) {
					throw _iteratorError9;
				}
			}
		}

		function remove_duplicate_comment(arr) {
			var cidArray = [];
			var temp = '';
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = arr[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var i = _step10.value;

					var _obj = i;
					if (i.cid === temp.cid) {
						var thisdata = _obj;
						var last = cidArray.pop();
						if (thisdata.score > last.score) {
							last = thisdata;
						}
						cidArray.push(last);
					} else {
						temp = _obj;
						cidArray.push(_obj);
					}
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10.return) {
						_iterator10.return();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			return cidArray;
		}
		var sort_array = remove_duplicate_comment(score_array.sort(function (a, b) {
			return b.cid - a.cid;
		}));
		data.mergeData(sort_array.sort(function (a, b) {
			return b.userid - a.userid;
		}));
	},
	mergeData: function mergeData(arr) {
		var finalArray = [];
		var temp = '';
		var _iteratorNormalCompletion12 = true;
		var _didIteratorError12 = false;
		var _iteratorError12 = undefined;

		try {
			for (var _iterator12 = arr[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
				var i = _step12.value;

				var _obj2 = i;
				if (i.userid === temp.userid) {
					var thisdata = _obj2;
					var last = finalArray.pop();
					last.id.push(thisdata);
					last.comment_count += _obj2.comment_count;
					last.like_count += _obj2.like_count;
					last.tag_count += _obj2.tag_count;
					last.score += _obj2.score;
					finalArray.push(last);
				} else {
					var _thisdata = {
						'id': _obj2.id,
						'message': _obj2.message,
						'like_count': _obj2.like_count,
						'comment_count': _obj2.comment_count,
						'tag_count': _obj2.tag_count,
						'score': _obj2.score
					};
					_obj2.id = [_thisdata];
					temp = _obj2;
					finalArray.push(_obj2);
				}
			}
		} catch (err) {
			_didIteratorError12 = true;
			_iteratorError12 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion12 && _iterator12.return) {
					_iterator12.return();
				}
			} finally {
				if (_didIteratorError12) {
					throw _iteratorError12;
				}
			}
		}

		data.finalArray = finalArray.sort(function (a, b) {
			return b.score - a.score;
		});
		data.finalArray = data.finalArray.map(function (item) {
			item.from = {
				"id": item.userid,
				"name": item.username
			};
			return item;
		});
		console.log(data.finalArray);
		$('.loading').removeClass('show');

		localStorage.ranker = JSON.stringify(data.finalArray);
		$('aside').addClass('finish');

		table.generate(data.finalArray);
		chart.draw(data.finalArray);
	}
};
var chart = {
	draw: function draw(finalArray) {
		d3.select("svg").remove();
		var arr = [];
		var w = 750;
		var count = 10;
		if (finalArray.length < count) count = finalArray.length;
		for (var i = 0; i < count; i++) {
			finalArray[i].index = i;
			arr.push(finalArray[i]);
		}
		var maxScore = d3.max(arr, function (d) {
			return d.score;
		});
		console.log(maxScore);
		var xScale = d3.scale.linear().domain([0, maxScore]).range([0, w - 80]);

		var c = d3.select('.chart').append('svg');
		c.selectAll('rect').data(arr).enter().append('rect').attr({
			'fill': '#E0972A',
			'width': 0,
			'height': '30',
			'x': function x(d) {
				return 0;
			},
			'y': function y(d) {
				return d.index * 40;
			}
		}).transition().duration(1500).attr({
			'width': function width(d) {
				return xScale(d.score);
			}
		});
		c.selectAll('text.score').data(arr).enter().append('text').text(function (d) {
			return d.score + '分';
		}).attr({
			'fill': '#e0972a',
			'x': 0,
			'y': function y(d) {
				return d.index * 40 + 20;
			}
		}).transition().duration(1500).attr({
			'x': function x(d) {
				return xScale(d.score) + 40;
			}
		});
		c.selectAll('text.name').data(arr).enter().append('text').text(function (d) {
			return d.username;
		}).attr({
			'fill': '#FFF',
			'text-anchor': 'end',
			'x': 0,
			'y': function y(d) {
				return d.index * 40 + 20;
			}
		}).transition().duration(1500).attr({
			'x': function x(d) {
				return xScale(d.score) - 10;
			}
		});
		c.selectAll('img').data(arr).enter().append('svg:image').attr({
			'xlink:href': function xlinkHref(d) {
				return 'http://graph.facebook.com/' + d.userid + '/picture?width=30&height=30';
			},
			'width': 30,
			'height': 30,
			'x': 0,
			'y': function y(d) {
				return d.index * 40;
			}
		}).transition().duration(1500).attr({
			'x': function x(d) {
				return xScale(d.score);
			}
		});
	}
};
var table = {
	generate: function generate(rawdata) {
		$(".tables table").DataTable().destroy();
		$('.result .info .all_people span').text(rawdata.length);
		$('.result .info .date_range span').text(data.dateRange.string);
		var count = 1;
		var tbody = '';
		var _iteratorNormalCompletion13 = true;
		var _didIteratorError13 = false;
		var _iteratorError13 = undefined;

		try {
			for (var _iterator13 = rawdata[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
				var i = _step13.value;

				tbody += "<tr>\n\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + i.userid + "\" target=_blank>" + i.username + "</a></td>\n\t\t\t\t\t\t<td>" + i.score + "</td><td><button onclick=\"popup.show('" + i.userid + "')\">\u8A73\u7D30\u8CC7\u8A0A</button></td>\n\t\t\t\t\t  </tr>";
				count++;
			}
		} catch (err) {
			_didIteratorError13 = true;
			_iteratorError13 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion13 && _iterator13.return) {
					_iterator13.return();
				}
			} finally {
				if (_didIteratorError13) {
					throw _iteratorError13;
				}
			}
		}

		$(".tables table tbody").html('').append(tbody);

		active();

		function active() {
			var table = $(".tables table").DataTable({
				"pageLength": 1000,
				"searching": true,
				"lengthChange": false
			});
		}
	},
	redo: function redo() {
		data.filter(data.raw, true);
	}
};
var popup = {
	show: function show(tar) {
		var tbody = '';
		var _iteratorNormalCompletion14 = true;
		var _didIteratorError14 = false;
		var _iteratorError14 = undefined;

		try {
			for (var _iterator14 = data.finalArray[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
				var i = _step14.value;

				if (tar == i.userid) {
					var count = 1;
					$('.popup p span').text(i.username);
					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = i.id[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var j = _step15.value;

							var message = j.message;
							if (message == '') message = '=====無內文=====';
							tbody += "<tr>\n\t\t\t\t\t\t\t\t<td>" + count + "</td>\n\t\t\t\t\t\t\t\t<td><a href=\"http://www.facebook.com/" + j.id + "\" target=\"_blank\">" + message + "</a></td>\n\t\t\t\t\t\t\t\t<td>" + j.comment_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.tag_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.like_count + "</td>\n\t\t\t\t\t\t\t\t<td>" + j.score + "</td>\n\t\t\t\t\t\t\t  </tr>";
							count++;
						}
					} catch (err) {
						_didIteratorError15 = true;
						_iteratorError15 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion15 && _iterator15.return) {
								_iterator15.return();
							}
						} finally {
							if (_didIteratorError15) {
								throw _iteratorError15;
							}
						}
					}

					$(".popup table tbody").html('').append(tbody);
				}
			}
		} catch (err) {
			_didIteratorError14 = true;
			_iteratorError14 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion14 && _iterator14.return) {
					_iterator14.return();
				}
			} finally {
				if (_didIteratorError14) {
					throw _iteratorError14;
				}
			}
		}

		$('.popup').addClass('show');
	},
	hide: function hide() {
		$('.popup').removeClass('show');
	}
};

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
	var arrData = (typeof JSONData === "undefined" ? "undefined" : _typeof(JSONData)) != 'object' ? JSON.parse(JSONData) : JSONData;

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
	var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(CSV);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZXJyb3JNZXNzYWdlIiwid2luZG93Iiwib25lcnJvciIsImhhbmRsZUVyciIsIm1zZyIsInVybCIsImwiLCJjb25zb2xlIiwibG9nIiwiJCIsImZhZGVJbiIsImNvbmZpZyIsImZpZWxkIiwiY29tbWVudHMiLCJyZWFjdGlvbnMiLCJzaGFyZWRwb3N0cyIsInVybF9jb21tZW50cyIsImZlZWQiLCJsaW1pdCIsImFwaVZlcnNpb24iLCJncm91cCIsIm5ld2VzdCIsImF1dGgiLCJleHRlbnNpb24iLCJwYWdlVG9rZW4iLCJmYiIsIm5leHQiLCJmZWVkcyIsImdldEF1dGgiLCJ0eXBlIiwiRkIiLCJsb2dpbiIsInJlc3BvbnNlIiwiY2FsbGJhY2siLCJzY29wZSIsInJldHVybl9zY29wZXMiLCJzdGF0dXMiLCJhdXRoU3RyIiwiYXV0aFJlc3BvbnNlIiwiZ3JhbnRlZFNjb3BlcyIsImluZGV4T2YiLCJzdGFydCIsInN3YWwiLCJkb25lIiwiZmJpZCIsImluaXQiLCJQcm9taXNlIiwiYWxsIiwiZ2V0UGFnZSIsImdldEdyb3VwIiwidGhlbiIsInJlcyIsInNlc3Npb25TdG9yYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsImdlbk9wdGlvbiIsIm9wdGlvbnMiLCJhZGRDbGFzcyIsImkiLCJqIiwiaWQiLCJuYW1lIiwiYXBwZW5kIiwic2VsZWN0MiIsInNlbGVjdFBhZ2UiLCJ0YXIiLCJmaW5kIiwiYXR0ciIsInNldFRva2VuIiwidmFsIiwicGFnZWlkIiwicGFnZXMiLCJwYXJzZSIsImFjY2Vzc190b2tlbiIsInBhZ2VJRCIsImNsZWFyIiwidGV4dCIsImNvbW1hbmQiLCJhcGkiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwicGlja2FkYXRlIiwiZ2V0IiwiZW5kIiwiZGF0YSIsImxlbmd0aCIsInBhZ2luZyIsImFsZXJ0IiwicmVtb3ZlQ2xhc3MiLCJwdXNoIiwiZ2V0TWUiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXJyIiwiZ3JvdXBzIiwiYWRtaW5pc3RyYXRvciIsImdldE5hbWUiLCJpZHMiLCJ0b1N0cmluZyIsInVzZXJpZCIsIm5vd0xlbmd0aCIsInByb21pc2VfYXJyYXkiLCJmaW5hbEFycmF5IiwiZGF0ZVJhbmdlIiwicmF3IiwiZGF0ZUNoZWNrIiwibWVzc2FnZSIsImQxIiwicGljayIsImQyIiwidGVtcCIsInJhbmdlIiwiY2hlY2siLCJvYmoiLCJmdWxsSUQiLCJwcm9taXNlIiwiY291bnRfc2NvcmUiLCJkYXRhcyIsInRva2VuIiwiZCIsImlzX2hpZGRlbiIsImNpZCIsImZyb20iLCJzdWJzdHIiLCJnZXROZXh0IiwicmVwbGFjZSIsImdldEpTT04iLCJmYWlsIiwic2NvcmVfYXJyYXkiLCJzY29yZV9ydWxlIiwic2NvcmUiLCJjb21tZW50X2NvdW50IiwiY29tbWVudHNfbWF4IiwidXNlciIsImxpa2VfY291bnQiLCJyZWFjdGlvbnNfbWF4IiwiY2VpbCIsIm1lc3NhZ2VfdGFncyIsInRhZ19jb3VudCIsInRhZyIsInRhZ19tYXgiLCJyZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQiLCJjaWRBcnJheSIsInRoaXNkYXRhIiwibGFzdCIsInBvcCIsInNvcnRfYXJyYXkiLCJzb3J0IiwiYSIsImIiLCJtZXJnZURhdGEiLCJtYXAiLCJpdGVtIiwidXNlcm5hbWUiLCJsb2NhbFN0b3JhZ2UiLCJyYW5rZXIiLCJ0YWJsZSIsImdlbmVyYXRlIiwiY2hhcnQiLCJkcmF3IiwiZDMiLCJzZWxlY3QiLCJyZW1vdmUiLCJ3IiwiY291bnQiLCJpbmRleCIsIm1heFNjb3JlIiwibWF4IiwieFNjYWxlIiwic2NhbGUiLCJsaW5lYXIiLCJkb21haW4iLCJjIiwic2VsZWN0QWxsIiwiZW50ZXIiLCJ0cmFuc2l0aW9uIiwiZHVyYXRpb24iLCJyYXdkYXRhIiwiRGF0YVRhYmxlIiwiZGVzdHJveSIsInN0cmluZyIsInRib2R5IiwiaHRtbCIsImFjdGl2ZSIsInJlZG8iLCJmaWx0ZXIiLCJwb3B1cCIsInNob3ciLCJoaWRlIiwib2JqMkFycmF5IiwiYXJyYXkiLCJ2YWx1ZSIsImdlblJhbmRvbUFycmF5IiwibiIsImFyeSIsIkFycmF5IiwiciIsInQiLCJyYW5kb20iLCJKU09OVG9DU1ZDb252ZXJ0b3IiLCJKU09ORGF0YSIsIlJlcG9ydFRpdGxlIiwiU2hvd0xhYmVsIiwiYXJyRGF0YSIsIkNTViIsInJvdyIsInNsaWNlIiwiZmlsZU5hbWUiLCJ1cmkiLCJlbmNvZGVVUkkiLCJsaW5rIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHJlZiIsInN0eWxlIiwiZG93bmxvYWQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGljayIsInJlbW92ZUNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsZUFBZSxLQUFuQjtBQUNBQyxPQUFPQyxPQUFQLEdBQWlCQyxTQUFqQjs7QUFFQSxTQUFTQSxTQUFULENBQW1CQyxHQUFuQixFQUF3QkMsR0FBeEIsRUFBNkJDLENBQTdCLEVBQWdDO0FBQy9CLEtBQUksQ0FBQ04sWUFBTCxFQUFtQjtBQUNsQk8sVUFBUUMsR0FBUixDQUFZLG1DQUFaLEVBQWlELDRCQUFqRDtBQUNBQyxJQUFFLGlCQUFGLEVBQXFCQyxNQUFyQjtBQUNBVixpQkFBZSxJQUFmO0FBQ0E7QUFDRCxRQUFPLEtBQVA7QUFDQTs7QUFFRCxJQUFJVyxTQUFTO0FBQ1pDLFFBQU87QUFDTkMsWUFBVSxDQUFDLE1BQUQsRUFBUyxZQUFULEVBQXVCLGVBQXZCLEVBQXdDLFdBQXhDLEVBQXFELFdBQXJELEVBQWtFLFNBQWxFLEVBQTZFLGNBQTdFLENBREo7QUFFTkMsYUFBVyxFQUZMO0FBR05DLGVBQWEsQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixjQUFsQixDQUhQO0FBSU5DLGdCQUFjLEVBSlI7QUFLTkMsUUFBTTtBQUxBLEVBREs7QUFRWkMsUUFBTztBQUNOTCxZQUFVLEtBREo7QUFFTkMsYUFBVyxLQUZMO0FBR05DLGVBQWEsS0FIUDtBQUlOQyxnQkFBYyxLQUpSO0FBS05DLFFBQU07QUFMQSxFQVJLO0FBZVpFLGFBQVk7QUFDWE4s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Q0FBVSxDQUFWLEVBQWFELElBQUl4SCxNQUFKLEdBQWEsQ0FBMUI7O0FBRUE7QUFDQXVILFNBQU9DLE1BQU0sTUFBYjtBQUNBOztBQUVELEtBQUlELE9BQU8sRUFBWCxFQUFlO0FBQ2RySCxRQUFNLGNBQU47QUFDQTtBQUNBOztBQUVEO0FBQ0EsS0FBSXdILFdBQVcsRUFBZjtBQUNBO0FBQ0FBLGFBQVlOLFlBQVk1RSxPQUFaLENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLENBQVo7O0FBRUE7QUFDQSxLQUFJbUYsTUFBTSx1Q0FBdUNDLFVBQVVMLEdBQVYsQ0FBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFJTSxPQUFPQyxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQVg7QUFDQUYsTUFBS0csSUFBTCxHQUFZTCxHQUFaOztBQUVBO0FBQ0FFLE1BQUtJLEtBQUwsR0FBYSxtQkFBYjtBQUNBSixNQUFLSyxRQUFMLEdBQWdCUixXQUFXLE1BQTNCOztBQUVBO0FBQ0FJLFVBQVNLLElBQVQsQ0FBY0MsV0FBZCxDQUEwQlAsSUFBMUI7QUFDQUEsTUFBS1EsS0FBTDtBQUNBUCxVQUFTSyxJQUFULENBQWNHLFdBQWQsQ0FBMEJULElBQTFCO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBlcnJvck1lc3NhZ2UgPSBmYWxzZTtcclxud2luZG93Lm9uZXJyb3IgPSBoYW5kbGVFcnJcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUVycihtc2csIHVybCwgbCkge1xyXG5cdGlmICghZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhcIiVj55m855Sf6Yyv6Kqk77yM6KuL5bCH5a6M5pW06Yyv6Kqk6KiK5oGv5oiq5ZyW5YKz6YCB57Wm566h55CG5ZOh77yM5Lim6ZmE5LiK5L2g6Ly45YWl55qE57ay5Z2AXCIsIFwiZm9udC1zaXplOjMwcHg7IGNvbG9yOiNGMDBcIik7XHJcblx0XHQkKFwiLmNvbnNvbGUgLmVycm9yXCIpLmZhZGVJbigpO1xyXG5cdFx0ZXJyb3JNZXNzYWdlID0gdHJ1ZTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5sZXQgY29uZmlnID0ge1xyXG5cdGZpZWxkOiB7XHJcblx0XHRjb21tZW50czogWydmcm9tJywgJ2xpa2VfY291bnQnLCAnY29tbWVudF9jb3VudCcsICdyZWFjdGlvbnMnLCAnaXNfaGlkZGVuJywgJ21lc3NhZ2UnLCAnbWVzc2FnZV90YWdzJ10sXHJcblx0XHRyZWFjdGlvbnM6IFtdLFxyXG5cdFx0c2hhcmVkcG9zdHM6IFsnc3RvcnknLCAnZnJvbScsICdjcmVhdGVkX3RpbWUnXSxcclxuXHRcdHVybF9jb21tZW50czogW10sXHJcblx0XHRmZWVkOiBbXVxyXG5cdH0sXHJcblx0bGltaXQ6IHtcclxuXHRcdGNvbW1lbnRzOiAnNTAwJyxcclxuXHRcdHJlYWN0aW9uczogJzUwMCcsXHJcblx0XHRzaGFyZWRwb3N0czogJzUwMCcsXHJcblx0XHR1cmxfY29tbWVudHM6ICc1MDAnLFxyXG5cdFx0ZmVlZDogJzUwMCdcclxuXHR9LFxyXG5cdGFwaVZlcnNpb246IHtcclxuXHRcdGNvbW1lbnRzOiAndjMuMScsXHJcblx0XHRyZWFjdGlvbnM6ICd2My4xJyxcclxuXHRcdGZlZWQ6ICd2My4xJyxcclxuXHRcdGdyb3VwOiAndjMuMScsXHJcblx0XHRuZXdlc3Q6ICd2Mi44J1xyXG5cdH0sXHJcblx0YXV0aDogJ21hbmFnZV9wYWdlcyxncm91cHNfYWNjZXNzX21lbWJlcl9pbmZvJyxcclxuXHRleHRlbnNpb246IGZhbHNlLFxyXG5cdHBhZ2VUb2tlbjogJycsXHJcbn1cclxuXHJcbmxldCBmYiA9IHtcclxuXHRuZXh0OiAnJyxcclxuXHRmZWVkczogW10sXHJcblx0Z2V0QXV0aDogKHR5cGUpID0+IHtcclxuXHRcdEZCLmxvZ2luKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHR9LCB7XHJcblx0XHRcdHNjb3BlOiBjb25maWcuYXV0aCxcclxuXHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjYWxsYmFjazogKHJlc3BvbnNlLCB0eXBlKSA9PiB7XHJcblx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAnY29ubmVjdGVkJykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdGlmICh0eXBlID09IFwiYWRkU2NvcGVcIikge1xyXG5cdFx0XHRcdGxldCBhdXRoU3RyID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlLmdyYW50ZWRTY29wZXM7XHJcblx0XHRcdFx0aWYgKGF1dGhTdHIuaW5kZXhPZigndXNlcl9wb3N0cycpID49IDApIHtcclxuXHRcdFx0XHRcdGZiLnN0YXJ0KCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHN3YWwoXHJcblx0XHRcdFx0XHRcdCfmjojmrIrlpLHmlZfvvIzoq4vntabkuojmiYDmnInmrIrpmZAnLFxyXG5cdFx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbiBGYWlsZWQhIFBsZWFzZSBjb250YWN0IHRoZSBhZG1pbi4nLFxyXG5cdFx0XHRcdFx0XHQnZXJyb3InXHJcblx0XHRcdFx0XHQpLmRvbmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmJpZC5pbml0KHR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRGQi5sb2dpbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0XHRmYi5jYWxsYmFjayhyZXNwb25zZSwgdHlwZSk7XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHRzY29wZTogY29uZmlnLmF1dGgsXHJcblx0XHRcdFx0cmV0dXJuX3Njb3BlczogdHJ1ZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKSA9PiB7XHJcblx0XHRQcm9taXNlLmFsbChbZmIuZ2V0UGFnZSgpLCBmYi5nZXRHcm91cCgpXSkudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLmxvZ2luID0gSlNPTi5zdHJpbmdpZnkocmVzKTtcclxuXHRcdFx0ZmIuZ2VuT3B0aW9uKHJlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdlbk9wdGlvbjogKHJlcykgPT4ge1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IG9wdGlvbnMgPSAnJztcclxuXHRcdGxldCB0eXBlID0gLTE7XHJcblx0XHQkKCdhc2lkZScpLmFkZENsYXNzKCdsb2dpbicpO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiByZXMpIHtcclxuXHRcdFx0dHlwZSsrO1xyXG5cdFx0XHRmb3IgKGxldCBqIG9mIGkpIHtcclxuXHRcdFx0XHRvcHRpb25zICs9IGA8b3B0aW9uIGF0dHItdHlwZT1cIiR7dHlwZX1cIiB2YWx1ZT1cIiR7ai5pZH1cIj4ke2oubmFtZX08L29wdGlvbj5gO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQkKCdhc2lkZSAuc3RlcDEgc2VsZWN0JykuYXBwZW5kKG9wdGlvbnMpO1xyXG5cdFx0JCgnYXNpZGUgc2VsZWN0Jykuc2VsZWN0MigpO1xyXG5cdFx0Ly8gJCgnYXNpZGUgc2VsZWN0Jykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0Ly8gXHRsZXQgdHlwZSA9ICQodGhpcykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHQvLyBcdGZiLnNlbGVjdFBhZ2UoZXZlbnQudGFyZ2V0LnZhbHVlLCB0eXBlKTtcclxuXHRcdC8vIH0pO1xyXG5cdH0sXHJcblx0c2VsZWN0UGFnZTogKCkgPT4ge1xyXG5cdFx0ZmIubmV4dCA9ICcnO1xyXG5cdFx0bGV0IHRhciA9ICQoJ2FzaWRlIHNlbGVjdCcpO1xyXG5cdFx0bGV0IHR5cGUgPSB0YXIuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignYXR0ci10eXBlJyk7XHJcblx0XHRpZiAodHlwZSA9PSAxKSB7XHJcblx0XHRcdGZiLnNldFRva2VuKHRhci5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCd2YWx1ZScpKTtcclxuXHRcdH1cclxuXHRcdGZiLmZlZWQodGFyLnZhbCgpLCB0eXBlLCBmYi5uZXh0KTtcclxuXHR9LFxyXG5cdHNldFRva2VuOiAocGFnZWlkKSA9PiB7XHJcblx0XHRsZXQgcGFnZXMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmxvZ2luKVsxXTtcclxuXHRcdGZvciAobGV0IGkgb2YgcGFnZXMpIHtcclxuXHRcdFx0aWYgKGkuaWQgPT0gcGFnZWlkKSB7XHJcblx0XHRcdFx0Y29uZmlnLnBhZ2VUb2tlbiA9IGkuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRmZWVkOiAocGFnZUlELCB0eXBlLCB1cmwgPSAnJywgY2xlYXIgPSB0cnVlKSA9PiB7XHJcblx0XHQkKCdidXR0b24uc3RhcnQnKS5hZGRDbGFzcygnZGlzYWJsZWQnKS50ZXh0KCdMb2FkaW5nLi4uJyk7XHJcblx0XHRsZXQgY29tbWFuZCA9ICdmZWVkJztcclxuXHRcdGxldCBhcGk7XHJcblx0XHRsZXQgc3RhcnQgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKSkgLyAxMDAwKTtcclxuXHRcdGxldCBlbmQgPSBNYXRoLmZsb29yKERhdGUucGFyc2UoJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5LW1tLWRkJykpIC8gMTAwMCk7XHJcblx0XHQvLzE0Njg0NjY5OTAwOTc2MjNcclxuXHRcdGlmICh1cmwgPT0gJycpIHtcclxuXHRcdFx0YXBpID0gYCR7cGFnZUlEfS8ke2NvbW1hbmR9P3NpbmNlPSR7c3RhcnR9JnVudGlsPSR7ZW5kfSZmaWVsZHM9bGluayxmdWxsX3BpY3R1cmUsY3JlYXRlZF90aW1lLG1lc3NhZ2UmbGltaXQ9MTAwYDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGFwaSA9IHVybDtcclxuXHRcdH1cclxuXHRcdEZCLmFwaShgLyR7cGFnZUlEfT9maWVsZHM9YWNjZXNzX3Rva2VuYCwgZnVuY3Rpb24gKHJlcykge1xyXG5cdFx0XHRpZiAocmVzLmFjY2Vzc190b2tlbikge1xyXG5cdFx0XHRcdGNvbmZpZy5wYWdlVG9rZW4gPSByZXMuYWNjZXNzX3Rva2VuO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdEZCLmFwaShhcGksIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0Y29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYXBpKTtcclxuXHRcdFx0aWYgKHJlcy5kYXRhLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRmYi5mZWVkcyA9IHJlcy5kYXRhO1xyXG5cdFx0XHRcdGlmIChyZXMucGFnaW5nKSB7XHJcblx0XHRcdFx0XHRuZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YWxlcnQoJ+aykuacieizh+aWmScpO1xyXG5cdFx0XHRcdCQoJ2J1dHRvbi5zdGFydCcpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnRleHQoJ+mWi+WniycpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGZ1bmN0aW9uIG5leHQodXJsKSB7XHJcblx0XHRcdGlmICh1cmwpIHtcclxuXHRcdFx0XHQkLmdldCh1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRmYi5mZWVkcy5wdXNoKGkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChyZXMucGFnaW5nKSB7XHJcblx0XHRcdFx0XHRcdFx0bmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0ZGF0YS5zdGFydCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGRhdGEuc3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TWU6ICgpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9L21lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGxldCBhcnIgPSBbcmVzXTtcclxuXHRcdFx0XHRyZXNvbHZlKGFycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRQYWdlOiAoKSA9PiB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb24ubmV3ZXN0fS9tZS9hY2NvdW50cz9saW1pdD0xMDBgLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMuZGF0YSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRnZXRHcm91cDogKCkgPT4ge1xyXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0RkIuYXBpKGAke2NvbmZpZy5hcGlWZXJzaW9uLm5ld2VzdH0vbWUvZ3JvdXBzP2xpbWl0PTEwMCZmaWVsZHM9YWRtaW5pc3RyYXRvcixuYW1lYCwgKHJlcykgPT4ge1xyXG5cdFx0XHRcdGxldCBncm91cHMgPSBbXTtcclxuXHRcdFx0XHRmb3IobGV0IGkgb2YgcmVzLmRhdGEpe1xyXG5cdFx0XHRcdFx0aWYgKGkuYWRtaW5pc3RyYXRvcikgZ3JvdXBzLnB1c2goaSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlc29sdmUoZ3JvdXBzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldE5hbWU6IChpZHMpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdEZCLmFwaShgJHtjb25maWcuYXBpVmVyc2lvbi5uZXdlc3R9Lz9pZHM9JHtpZHMudG9TdHJpbmcoKX1gLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0cmVzb2x2ZShyZXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxubGV0IGRhdGEgPSB7XHJcblx0dXNlcmlkOiAnJyxcclxuXHRub3dMZW5ndGg6IDAsXHJcblx0ZXh0ZW5zaW9uOiBmYWxzZSxcclxuXHRwcm9taXNlX2FycmF5OiBbXSxcclxuXHRmaW5hbEFycmF5OiBbXSxcclxuXHRkYXRlUmFuZ2U6IHt9LFxyXG5cdGluaXQ6ICgpID0+IHtcclxuXHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCcnKTtcclxuXHRcdGRhdGEubm93TGVuZ3RoID0gMDtcclxuXHRcdGRhdGEucHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0ZGF0YS5yYXcgPSBbXTtcclxuXHR9LFxyXG5cdGRhdGVDaGVjazogKCkgPT4ge1xyXG5cdFx0bGV0IHN0YXJ0ID0gJCgnI3N0YXJ0X2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKTtcclxuXHRcdGxldCBlbmQgPSAkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JywgJ3l5eXktbW0tZGQnKTtcclxuXHRcdGxldCBtZXNzYWdlID0gJyc7XHJcblx0XHRpZiAoc3RhcnQgPT0gJycgfHwgZW5kID09ICcnKSB7XHJcblx0XHRcdG1lc3NhZ2UgPSAn6KuL6YG45pOH5pel5pyfJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxldCBkMSA9IG5ldyBEYXRlKCQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcpLnBpY2spO1xyXG5cdFx0XHRsZXQgZDIgPSBuZXcgRGF0ZSgkKCcjZW5kX2RhdGUnKS5waWNrYWRhdGUoJ3BpY2tlcicpLmdldCgnc2VsZWN0JykucGljayk7XHJcblx0XHRcdGlmIChkMiAtIGQxID4gNTE4NDAwMDAwMCkge1xyXG5cdFx0XHRcdG1lc3NhZ2UgPSAn5pel5pyf5Y2A6ZaT5LiN6IO96LaF6YGONjDlpKknO1xyXG5cdFx0XHRcdC8vIGxldCB0ZW1wID0gc3RhcnQ7XHJcblx0XHRcdFx0Ly8gc3RhcnQgPSBlbmQ7XHJcblx0XHRcdFx0Ly8gZW5kID0gdGVtcDtcclxuXHRcdFx0fSBlbHNlIGlmIChkMiA8IGQxKSB7XHJcblx0XHRcdFx0bGV0IHRlbXAgPSBzdGFydDtcclxuXHRcdFx0XHRzdGFydCA9IGVuZDtcclxuXHRcdFx0XHRlbmQgPSB0ZW1wO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobWVzc2FnZSA9PSAnJykge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdCdjaGVjayc6IHRydWUsXHJcblx0XHRcdFx0J3JhbmdlJzogYHNpbmNlPSR7c3RhcnR9JnVudGlsPSR7ZW5kfWAsXHJcblx0XHRcdFx0J3N0cmluZyc6ICQoJyNzdGFydF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5L21tL2RkJykgKyBcIiB+IFwiICsgJCgnI2VuZF9kYXRlJykucGlja2FkYXRlKCdwaWNrZXInKS5nZXQoJ3NlbGVjdCcsICd5eXl5L21tL2RkJyksXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0J2NoZWNrJzogZmFsc2UsXHJcblx0XHRcdFx0J21lc3NhZ2UnOiBtZXNzYWdlXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHN0YXJ0OiAoKSA9PiB7XHJcblx0XHQkKCdidXR0b24uc3RhcnQnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS50ZXh0KCfplovlp4snKTtcclxuXHRcdGRhdGEuaW5pdCgpO1xyXG5cdFx0bGV0IHJhbmdlID0gZGF0YS5kYXRlQ2hlY2soKTtcclxuXHRcdGlmIChyYW5nZS5jaGVjayA9PT0gdHJ1ZSkge1xyXG5cdFx0XHRkYXRhLmRhdGVSYW5nZSA9IHJhbmdlO1xyXG5cdFx0XHRsZXQgYWxsID0gW107XHJcblx0XHRcdGZvciAobGV0IGogb2YgZmIuZmVlZHMpIHtcclxuXHRcdFx0XHRsZXQgb2JqID0ge1xyXG5cdFx0XHRcdFx0ZnVsbElEOiBqLmlkLFxyXG5cdFx0XHRcdFx0b2JqOiB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRsZXQgcHJvbWlzZSA9IGRhdGEuZ2V0KG9iaikudGhlbigocmVzKSA9PiB7XHJcblx0XHRcdFx0XHRvYmouZGF0YSA9IHJlcztcclxuXHRcdFx0XHRcdGFsbC5wdXNoKG9iaik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ZGF0YS5wcm9taXNlX2FycmF5LnB1c2gocHJvbWlzZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnLmxvYWRpbmcnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cdFx0XHRQcm9taXNlLmFsbChkYXRhLnByb21pc2VfYXJyYXkpLnRoZW4oKHJlcykgPT4ge1xyXG5cdFx0XHRcdGRhdGEuY291bnRfc2NvcmUoYWxsKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhbGVydChyYW5nZS5tZXNzYWdlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldDogKGZiaWQpID0+IHtcclxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRcdGxldCBkYXRhcyA9IFtdO1xyXG5cdFx0XHRsZXQgcHJvbWlzZV9hcnJheSA9IFtdO1xyXG5cdFx0XHRsZXQgY29tbWFuZCA9ICdjb21tZW50cyc7XHJcblx0XHRcdGxldCB0b2tlbiA9IChjb25maWcucGFnZVRva2VuKSA/ICcmYWNjZXNzX3Rva2VuPScgKyBjb25maWcucGFnZVRva2VuOicnO1xyXG5cdFx0XHRGQi5hcGkoYCR7Y29uZmlnLmFwaVZlcnNpb25bY29tbWFuZF19LyR7ZmJpZC5mdWxsSUR9L2NvbW1lbnRzPyR7ZGF0YS5kYXRlUmFuZ2UucmFuZ2V9Jm9yZGVyPWNocm9ub2xvZ2ljYWwmZmllbGRzPSR7Y29uZmlnLmZpZWxkW2NvbW1hbmRdLnRvU3RyaW5nKCl9JHt0b2tlbn1gLCAocmVzKSA9PiB7XHJcblx0XHRcdFx0aWYgKHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRkYXRhLm5vd0xlbmd0aCArPSByZXMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHQkKFwiLmNvbnNvbGUgLm1lc3NhZ2VcIikudGV4dCgn5bey5oiq5Y+WICAnICsgZGF0YS5ub3dMZW5ndGggKyAnIOethuizh+aWmS4uLicpO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2cocmVzKTtcclxuXHRcdFx0XHRcdGZvciAobGV0IGQgb2YgcmVzLmRhdGEpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFkLmlzX2hpZGRlbikge1xyXG5cdFx0XHRcdFx0XHRcdGQuY2lkID0gZC5mcm9tLmlkICsgJ18nICsgZC5pZC5zdWJzdHIoMCwgZC5pZC5pbmRleE9mKCdfJykpO1xyXG5cdFx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChyZXMuZGF0YS5sZW5ndGggPiAwICYmIHJlcy5wYWdpbmcubmV4dCkge1xyXG5cdFx0XHRcdFx0XHRnZXROZXh0KHJlcy5wYWdpbmcubmV4dCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXNvbHZlKGRhdGFzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJlc29sdmUoZGF0YXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBnZXROZXh0KHVybCwgbGltaXQgPSAwKSB7XHJcblx0XHRcdFx0aWYgKGxpbWl0ICE9PSAwKSB7XHJcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnbGltaXQ9NTAwJywgJ2xpbWl0PScgKyBsaW1pdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXMpIHtcclxuXHRcdFx0XHRcdGRhdGEubm93TGVuZ3RoICs9IHJlcy5kYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRcdCQoXCIuY29uc29sZSAubWVzc2FnZVwiKS50ZXh0KCflt7LmiKrlj5YgICcgKyBkYXRhLm5vd0xlbmd0aCArICcg562G6LOH5paZLi4uJyk7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBkIG9mIHJlcy5kYXRhKSB7XHJcblx0XHRcdFx0XHRcdGRhdGFzLnB1c2goZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAocmVzLmRhdGEubGVuZ3RoID4gMCAmJiByZXMucGFnaW5nLm5leHQpIHtcclxuXHRcdFx0XHRcdFx0Z2V0TmV4dChyZXMucGFnaW5nLm5leHQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShkYXRhcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSkuZmFpbCgoKSA9PiB7XHJcblx0XHRcdFx0XHRnZXROZXh0KHVybCwgMjAwKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRjb3VudF9zY29yZTogKGFsbCkgPT4ge1xyXG5cdFx0LypcclxuXHRcdFx055WZ6KiAM+WIhuOAgVRBR+S4gOWAizHliIbvvIzmnIDlpJoz5YiGXHJcblx0XHRcdOeVmeiogOW/g+aDhTLlgIsx5YiG77yM54Sh5qKd5Lu26YCy5L2N77yM5pyA5aSaMTPliIZcclxuXHRcdFx055WZ6KiA55qE55WZ6KiA5LiA5YCLMeWIhu+8jOacgOWkpzbliIZcclxuXHRcdCovXHJcblx0XHRsZXQgc2NvcmVfYXJyYXkgPSBbXTtcclxuXHRcdGZvciAobGV0IGkgb2YgYWxsKSB7XHJcblx0XHRcdGxldCBhcnIgPSBpLmRhdGE7XHJcblx0XHRcdGxldCBzY29yZV9ydWxlID0ge1xyXG5cdFx0XHRcdCdjb21tZW50cyc6IDEsXHJcblx0XHRcdFx0J2NvbW1lbnRzX21heCc6IDYsXHJcblx0XHRcdFx0J3JlYWN0aW9ucyc6IDAuNSxcclxuXHRcdFx0XHQncmVhY3Rpb25zX21heCc6IDEzLFxyXG5cdFx0XHRcdCd0YWcnOiAxLFxyXG5cdFx0XHRcdCd0YWdfbWF4JzogM1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBzY29yZTtcclxuXHRcdFx0Zm9yIChsZXQgaiBvZiBhcnIpIHtcclxuXHRcdFx0XHRzY29yZSA9IDM7XHJcblx0XHRcdFx0c2NvcmUgKz0gKGouY29tbWVudF9jb3VudCAqIHNjb3JlX3J1bGUuY29tbWVudHMgPiBzY29yZV9ydWxlLmNvbW1lbnRzX21heCkgPyBzY29yZV9ydWxlLmNvbW1lbnRzX21heCA6IGouY29tbWVudF9jb3VudCAqIHNjb3JlX3J1bGUuY29tbWVudHM7XHJcblx0XHRcdFx0bGV0IHVzZXIgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBqLmlkLFxyXG5cdFx0XHRcdFx0J3VzZXJpZCc6IGouZnJvbS5pZCxcclxuXHRcdFx0XHRcdCd1c2VybmFtZSc6IGouZnJvbS5uYW1lLFxyXG5cdFx0XHRcdFx0J2NvbW1lbnRfY291bnQnOiBqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IGoubWVzc2FnZSxcclxuXHRcdFx0XHRcdCdjaWQnOiBqLmNpZFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYgKGoucmVhY3Rpb25zKSB7XHJcblx0XHRcdFx0XHRpZiAoai5yZWFjdGlvbnMuZGF0YS5sZW5ndGggPT09IDI1KSB7XHJcblx0XHRcdFx0XHRcdHVzZXIubGlrZV9jb3VudCA9IGoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRcdFx0c2NvcmUgKz0gc2NvcmVfcnVsZS5yZWFjdGlvbnNfbWF4O1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gai5yZWFjdGlvbnMuZGF0YS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdHNjb3JlICs9IE1hdGguY2VpbChqLnJlYWN0aW9ucy5kYXRhLmxlbmd0aCAqIHNjb3JlX3J1bGUucmVhY3Rpb25zKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dXNlci5saWtlX2NvdW50ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGoubWVzc2FnZV90YWdzKSB7XHJcblx0XHRcdFx0XHR1c2VyLnRhZ19jb3VudCA9IGoubWVzc2FnZV90YWdzLmxlbmd0aFxyXG5cdFx0XHRcdFx0c2NvcmUgKz0gKGoubWVzc2FnZV90YWdzLmxlbmd0aCAqIHNjb3JlX3J1bGUudGFnID49IHNjb3JlX3J1bGUudGFnX21heCkgPyBzY29yZV9ydWxlLnRhZ19tYXggOiBqLm1lc3NhZ2VfdGFncy5sZW5ndGggKiBzY29yZV9ydWxlLnRhZztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dXNlci50YWdfY291bnQgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR1c2VyLnNjb3JlID0gc2NvcmU7XHJcblx0XHRcdFx0c2NvcmVfYXJyYXkucHVzaCh1c2VyKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coc2NvcmVfYXJyYXkpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHJlbW92ZV9kdXBsaWNhdGVfY29tbWVudChhcnIpIHtcclxuXHRcdFx0bGV0IGNpZEFycmF5ID0gW107XHJcblx0XHRcdGxldCB0ZW1wID0gJyc7XHJcblx0XHRcdGZvciAobGV0IGkgb2YgYXJyKSB7XHJcblx0XHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdFx0aWYgKGkuY2lkID09PSB0ZW1wLmNpZCkge1xyXG5cdFx0XHRcdFx0bGV0IHRoaXNkYXRhID0gb2JqO1xyXG5cdFx0XHRcdFx0bGV0IGxhc3QgPSBjaWRBcnJheS5wb3AoKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzZGF0YS5zY29yZSA+IGxhc3Quc2NvcmUpIHtcclxuXHRcdFx0XHRcdFx0bGFzdCA9IHRoaXNkYXRhO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2lkQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGVtcCA9IG9iajtcclxuXHRcdFx0XHRcdGNpZEFycmF5LnB1c2gob2JqKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGNpZEFycmF5O1xyXG5cdFx0fVxyXG5cdFx0bGV0IHNvcnRfYXJyYXkgPSByZW1vdmVfZHVwbGljYXRlX2NvbW1lbnQoc2NvcmVfYXJyYXkuc29ydCgoYSwgYikgPT4gYi5jaWQgLSBhLmNpZCkpO1xyXG5cdFx0ZGF0YS5tZXJnZURhdGEoc29ydF9hcnJheS5zb3J0KChhLCBiKSA9PiBiLnVzZXJpZCAtIGEudXNlcmlkKSk7XHJcblx0fSxcclxuXHRtZXJnZURhdGE6IChhcnIpID0+IHtcclxuXHRcdGxldCBmaW5hbEFycmF5ID0gW107XHJcblx0XHRsZXQgdGVtcCA9ICcnO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBhcnIpIHtcclxuXHRcdFx0bGV0IG9iaiA9IGk7XHJcblx0XHRcdGlmIChpLnVzZXJpZCA9PT0gdGVtcC51c2VyaWQpIHtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSBvYmo7XHJcblx0XHRcdFx0bGV0IGxhc3QgPSBmaW5hbEFycmF5LnBvcCgpO1xyXG5cdFx0XHRcdGxhc3QuaWQucHVzaCh0aGlzZGF0YSk7XHJcblx0XHRcdFx0bGFzdC5jb21tZW50X2NvdW50ICs9IG9iai5jb21tZW50X2NvdW50O1xyXG5cdFx0XHRcdGxhc3QubGlrZV9jb3VudCArPSBvYmoubGlrZV9jb3VudDtcclxuXHRcdFx0XHRsYXN0LnRhZ19jb3VudCArPSBvYmoudGFnX2NvdW50O1xyXG5cdFx0XHRcdGxhc3Quc2NvcmUgKz0gb2JqLnNjb3JlO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChsYXN0KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsZXQgdGhpc2RhdGEgPSB7XHJcblx0XHRcdFx0XHQnaWQnOiBvYmouaWQsXHJcblx0XHRcdFx0XHQnbWVzc2FnZSc6IG9iai5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0J2xpa2VfY291bnQnOiBvYmoubGlrZV9jb3VudCxcclxuXHRcdFx0XHRcdCdjb21tZW50X2NvdW50Jzogb2JqLmNvbW1lbnRfY291bnQsXHJcblx0XHRcdFx0XHQndGFnX2NvdW50Jzogb2JqLnRhZ19jb3VudCxcclxuXHRcdFx0XHRcdCdzY29yZSc6IG9iai5zY29yZVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2JqLmlkID0gW3RoaXNkYXRhXTtcclxuXHRcdFx0XHR0ZW1wID0gb2JqO1xyXG5cdFx0XHRcdGZpbmFsQXJyYXkucHVzaChvYmopO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRkYXRhLmZpbmFsQXJyYXkgPSBmaW5hbEFycmF5LnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcclxuXHRcdGRhdGEuZmluYWxBcnJheSA9IGRhdGEuZmluYWxBcnJheS5tYXAoKGl0ZW0pID0+IHtcclxuXHRcdFx0aXRlbS5mcm9tID0ge1xyXG5cdFx0XHRcdFwiaWRcIjogaXRlbS51c2VyaWQsXHJcblx0XHRcdFx0XCJuYW1lXCI6IGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdCQoJy5sb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHJcblx0XHRsb2NhbFN0b3JhZ2UucmFua2VyID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5maW5hbEFycmF5KTtcclxuXHRcdCQoJ2FzaWRlJykuYWRkQ2xhc3MoJ2ZpbmlzaCcpO1xyXG5cclxuXHRcdHRhYmxlLmdlbmVyYXRlKGRhdGEuZmluYWxBcnJheSk7XHJcblx0XHRjaGFydC5kcmF3KGRhdGEuZmluYWxBcnJheSk7XHJcblx0fVxyXG59XHJcbmxldCBjaGFydCA9IHtcclxuXHRkcmF3OiAoZmluYWxBcnJheSkgPT4ge1xyXG5cdFx0ZDMuc2VsZWN0KFwic3ZnXCIpLnJlbW92ZSgpO1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0bGV0IHcgPSA3NTA7XHJcblx0XHRsZXQgY291bnQgPSAxMDtcclxuXHRcdGlmIChmaW5hbEFycmF5Lmxlbmd0aCA8IGNvdW50KSBjb3VudCA9IGZpbmFsQXJyYXkubGVuZ3RoO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XHJcblx0XHRcdGZpbmFsQXJyYXlbaV0uaW5kZXggPSBpO1xyXG5cdFx0XHRhcnIucHVzaChmaW5hbEFycmF5W2ldKTtcclxuXHRcdH1cclxuXHRcdHZhciBtYXhTY29yZSA9IGQzLm1heChhcnIsIGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdHJldHVybiBkLnNjb3JlXHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUubG9nKG1heFNjb3JlKVxyXG5cdFx0dmFyIHhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXHJcblx0XHRcdC5kb21haW4oWzAsIG1heFNjb3JlXSlcclxuXHRcdFx0LnJhbmdlKFswLCB3IC0gODBdKTtcclxuXHJcblx0XHR2YXIgYyA9IGQzLnNlbGVjdCgnLmNoYXJ0JykuYXBwZW5kKCdzdmcnKTtcclxuXHRcdGMuc2VsZWN0QWxsKCdyZWN0JylcclxuXHRcdFx0LmRhdGEoYXJyKVxyXG5cdFx0XHQuZW50ZXIoKVxyXG5cdFx0XHQuYXBwZW5kKCdyZWN0JylcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCdmaWxsJzogJyNFMDk3MkEnLFxyXG5cdFx0XHRcdCd3aWR0aCc6IDAsXHJcblx0XHRcdFx0J2hlaWdodCc6ICczMCcsXHJcblx0XHRcdFx0J3gnOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIDA7XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQneSc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZC5pbmRleCAqIDQwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudHJhbnNpdGlvbigpXHJcblx0XHRcdC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J3dpZHRoJzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdGMuc2VsZWN0QWxsKCd0ZXh0LnNjb3JlJylcclxuXHRcdFx0LmRhdGEoYXJyKVxyXG5cdFx0XHQuZW50ZXIoKVxyXG5cdFx0XHQuYXBwZW5kKCd0ZXh0JylcclxuXHRcdFx0LnRleHQoZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRyZXR1cm4gZC5zY29yZSArICfliIYnO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J2ZpbGwnOiAnI2UwOTcyYScsXHJcblx0XHRcdFx0J3gnOiAwLFxyXG5cdFx0XHRcdCd5JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiBkLmluZGV4ICogNDAgKyAyMFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdFx0LnRyYW5zaXRpb24oKVxyXG5cdFx0XHQuZHVyYXRpb24oMTUwMClcclxuXHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdCd4JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiB4U2NhbGUoZC5zY29yZSkgKyA0MDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0Yy5zZWxlY3RBbGwoJ3RleHQubmFtZScpXHJcblx0XHRcdC5kYXRhKGFycilcclxuXHRcdFx0LmVudGVyKClcclxuXHRcdFx0LmFwcGVuZCgndGV4dCcpXHJcblx0XHRcdC50ZXh0KGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0cmV0dXJuIGQudXNlcm5hbWU7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQnZmlsbCc6ICcjRkZGJyxcclxuXHRcdFx0XHQndGV4dC1hbmNob3InOiAnZW5kJyxcclxuXHRcdFx0XHQneCc6IDAsXHJcblx0XHRcdFx0J3knOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGQuaW5kZXggKiA0MCArIDIwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHQudHJhbnNpdGlvbigpXHJcblx0XHRcdC5kdXJhdGlvbigxNTAwKVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J3gnOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHhTY2FsZShkLnNjb3JlKSAtIDEwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRjLnNlbGVjdEFsbCgnaW1nJylcclxuXHRcdFx0LmRhdGEoYXJyKVxyXG5cdFx0XHQuZW50ZXIoKVxyXG5cdFx0XHQuYXBwZW5kKCdzdmc6aW1hZ2UnKVxyXG5cdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0J3hsaW5rOmhyZWYnOiBmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICdodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tLycgKyBkLnVzZXJpZCArICcvcGljdHVyZT93aWR0aD0zMCZoZWlnaHQ9MzAnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQnd2lkdGgnOiAzMCxcclxuXHRcdFx0XHQnaGVpZ2h0JzogMzAsXHJcblx0XHRcdFx0J3gnOiAwLFxyXG5cdFx0XHRcdCd5JzogZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdHJldHVybiBkLmluZGV4ICogNDBcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC50cmFuc2l0aW9uKClcclxuXHRcdFx0LmR1cmF0aW9uKDE1MDApXHJcblx0XHRcdC5hdHRyKHtcclxuXHRcdFx0XHQneCc6IGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4geFNjYWxlKGQuc2NvcmUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0fVxyXG59XHJcbmxldCB0YWJsZSA9IHtcclxuXHRnZW5lcmF0ZTogKHJhd2RhdGEpID0+IHtcclxuXHRcdCQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSgpLmRlc3Ryb3koKTtcclxuXHRcdCQoJy5yZXN1bHQgLmluZm8gLmFsbF9wZW9wbGUgc3BhbicpLnRleHQocmF3ZGF0YS5sZW5ndGgpO1xyXG5cdFx0JCgnLnJlc3VsdCAuaW5mbyAuZGF0ZV9yYW5nZSBzcGFuJykudGV4dChkYXRhLmRhdGVSYW5nZS5zdHJpbmcpO1xyXG5cdFx0bGV0IGNvdW50ID0gMTtcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiByYXdkYXRhKSB7XHJcblx0XHRcdHRib2R5ICs9IGA8dHI+XHJcblx0XHRcdFx0XHRcdDx0ZD4ke2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdDx0ZD48YSBocmVmPVwiaHR0cDovL3d3dy5mYWNlYm9vay5jb20vJHtpLnVzZXJpZH1cIiB0YXJnZXQ9X2JsYW5rPiR7aS51c2VybmFtZX08L2E+PC90ZD5cclxuXHRcdFx0XHRcdFx0PHRkPiR7aS5zY29yZX08L3RkPjx0ZD48YnV0dG9uIG9uY2xpY2s9XCJwb3B1cC5zaG93KCcke2kudXNlcmlkfScpXCI+6Kmz57Sw6LOH6KiKPC9idXR0b24+PC90ZD5cclxuXHRcdFx0XHRcdCAgPC90cj5gO1xyXG5cdFx0XHRjb3VudCsrO1xyXG5cdFx0fVxyXG5cdFx0JChcIi50YWJsZXMgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHJcblx0XHRhY3RpdmUoKTtcclxuXHJcblx0XHRmdW5jdGlvbiBhY3RpdmUoKSB7XHJcblx0XHRcdGxldCB0YWJsZSA9ICQoXCIudGFibGVzIHRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcblx0XHRcdFx0XCJwYWdlTGVuZ3RoXCI6IDEwMDAsXHJcblx0XHRcdFx0XCJzZWFyY2hpbmdcIjogdHJ1ZSxcclxuXHRcdFx0XHRcImxlbmd0aENoYW5nZVwiOiBmYWxzZVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZG86ICgpID0+IHtcclxuXHRcdGRhdGEuZmlsdGVyKGRhdGEucmF3LCB0cnVlKTtcclxuXHR9XHJcbn1cclxubGV0IHBvcHVwID0ge1xyXG5cdHNob3c6ICh0YXIpID0+IHtcclxuXHRcdGxldCB0Ym9keSA9ICcnO1xyXG5cdFx0Zm9yIChsZXQgaSBvZiBkYXRhLmZpbmFsQXJyYXkpIHtcclxuXHRcdFx0aWYgKHRhciA9PSBpLnVzZXJpZCkge1xyXG5cdFx0XHRcdGxldCBjb3VudCA9IDE7XHJcblx0XHRcdFx0JCgnLnBvcHVwIHAgc3BhbicpLnRleHQoaS51c2VybmFtZSk7XHJcblx0XHRcdFx0Zm9yIChsZXQgaiBvZiBpLmlkKSB7XHJcblx0XHRcdFx0XHRsZXQgbWVzc2FnZSA9IGoubWVzc2FnZTtcclxuXHRcdFx0XHRcdGlmIChtZXNzYWdlID09ICcnKSBtZXNzYWdlID0gJz09PT0954Sh5YWn5paHPT09PT0nO1xyXG5cdFx0XHRcdFx0dGJvZHkgKz0gYDx0cj5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+PGEgaHJlZj1cImh0dHA6Ly93d3cuZmFjZWJvb2suY29tLyR7ai5pZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke21lc3NhZ2V9PC9hPjwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLmNvbW1lbnRfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2oudGFnX2NvdW50fTwvdGQ+XHJcblx0XHRcdFx0XHRcdFx0XHQ8dGQ+JHtqLmxpa2VfY291bnR9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHRcdDx0ZD4ke2ouc2NvcmV9PC90ZD5cclxuXHRcdFx0XHRcdFx0XHQgIDwvdHI+YDtcclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCQoXCIucG9wdXAgdGFibGUgdGJvZHlcIikuaHRtbCgnJykuYXBwZW5kKHRib2R5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0JCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHR9LFxyXG5cdGhpZGU6ICgpID0+IHtcclxuXHRcdCQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBvYmoyQXJyYXkob2JqKSB7XHJcblx0bGV0IGFycmF5ID0gJC5tYXAob2JqLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4KSB7XHJcblx0XHRyZXR1cm4gW3ZhbHVlXTtcclxuXHR9KTtcclxuXHRyZXR1cm4gYXJyYXk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlblJhbmRvbUFycmF5KG4pIHtcclxuXHR2YXIgYXJ5ID0gbmV3IEFycmF5KCk7XHJcblx0dmFyIGksIHIsIHQ7XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0YXJ5W2ldID0gaTtcclxuXHR9XHJcblx0Zm9yIChpID0gMDsgaSA8IG47ICsraSkge1xyXG5cdFx0ciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xyXG5cdFx0dCA9IGFyeVtyXTtcclxuXHRcdGFyeVtyXSA9IGFyeVtpXTtcclxuXHRcdGFyeVtpXSA9IHQ7XHJcblx0fVxyXG5cdHJldHVybiBhcnk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEpTT05Ub0NTVkNvbnZlcnRvcihKU09ORGF0YSwgUmVwb3J0VGl0bGUsIFNob3dMYWJlbCkge1xyXG5cdC8vSWYgSlNPTkRhdGEgaXMgbm90IGFuIG9iamVjdCB0aGVuIEpTT04ucGFyc2Ugd2lsbCBwYXJzZSB0aGUgSlNPTiBzdHJpbmcgaW4gYW4gT2JqZWN0XHJcblx0dmFyIGFyckRhdGEgPSB0eXBlb2YgSlNPTkRhdGEgIT0gJ29iamVjdCcgPyBKU09OLnBhcnNlKEpTT05EYXRhKSA6IEpTT05EYXRhO1xyXG5cclxuXHR2YXIgQ1NWID0gJyc7XHJcblx0Ly9TZXQgUmVwb3J0IHRpdGxlIGluIGZpcnN0IHJvdyBvciBsaW5lXHJcblxyXG5cdC8vIENTViArPSBSZXBvcnRUaXRsZSArICdcXHJcXG5cXG4nO1xyXG5cclxuXHQvL1RoaXMgY29uZGl0aW9uIHdpbGwgZ2VuZXJhdGUgdGhlIExhYmVsL0hlYWRlclxyXG5cdGlmIChTaG93TGFiZWwpIHtcclxuXHRcdHZhciByb3cgPSBcIlwiO1xyXG5cclxuXHRcdC8vVGhpcyBsb29wIHdpbGwgZXh0cmFjdCB0aGUgbGFiZWwgZnJvbSAxc3QgaW5kZXggb2Ygb24gYXJyYXlcclxuXHRcdGZvciAodmFyIGluZGV4IGluIGFyckRhdGFbMF0pIHtcclxuXHJcblx0XHRcdC8vTm93IGNvbnZlcnQgZWFjaCB2YWx1ZSB0byBzdHJpbmcgYW5kIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRcdHJvdyArPSBpbmRleCArICcsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cgPSByb3cuc2xpY2UoMCwgLTEpO1xyXG5cclxuXHRcdC8vYXBwZW5kIExhYmVsIHJvdyB3aXRoIGxpbmUgYnJlYWtcclxuXHRcdENTViArPSByb3cgKyAnXFxyXFxuJztcclxuXHR9XHJcblxyXG5cdC8vMXN0IGxvb3AgaXMgdG8gZXh0cmFjdCBlYWNoIHJvd1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyRGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIHJvdyA9IFwiXCI7XHJcblxyXG5cdFx0Ly8ybmQgbG9vcCB3aWxsIGV4dHJhY3QgZWFjaCBjb2x1bW4gYW5kIGNvbnZlcnQgaXQgaW4gc3RyaW5nIGNvbW1hLXNlcHJhdGVkXHJcblx0XHRmb3IgKHZhciBpbmRleCBpbiBhcnJEYXRhW2ldKSB7XHJcblx0XHRcdHJvdyArPSAnXCInICsgYXJyRGF0YVtpXVtpbmRleF0gKyAnXCIsJztcclxuXHRcdH1cclxuXHJcblx0XHRyb3cuc2xpY2UoMCwgcm93Lmxlbmd0aCAtIDEpO1xyXG5cclxuXHRcdC8vYWRkIGEgbGluZSBicmVhayBhZnRlciBlYWNoIHJvd1xyXG5cdFx0Q1NWICs9IHJvdyArICdcXHJcXG4nO1xyXG5cdH1cclxuXHJcblx0aWYgKENTViA9PSAnJykge1xyXG5cdFx0YWxlcnQoXCJJbnZhbGlkIGRhdGFcIik7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cclxuXHQvL0dlbmVyYXRlIGEgZmlsZSBuYW1lXHJcblx0dmFyIGZpbGVOYW1lID0gXCJcIjtcclxuXHQvL3RoaXMgd2lsbCByZW1vdmUgdGhlIGJsYW5rLXNwYWNlcyBmcm9tIHRoZSB0aXRsZSBhbmQgcmVwbGFjZSBpdCB3aXRoIGFuIHVuZGVyc2NvcmVcclxuXHRmaWxlTmFtZSArPSBSZXBvcnRUaXRsZS5yZXBsYWNlKC8gL2csIFwiX1wiKTtcclxuXHJcblx0Ly9Jbml0aWFsaXplIGZpbGUgZm9ybWF0IHlvdSB3YW50IGNzdiBvciB4bHNcclxuXHR2YXIgdXJpID0gJ2RhdGE6dGV4dC9jc3Y7Y2hhcnNldD11dGYtOCxcXHVGRUZGJyArIGVuY29kZVVSSShDU1YpO1xyXG5cclxuXHQvLyBOb3cgdGhlIGxpdHRsZSB0cmlja3kgcGFydC5cclxuXHQvLyB5b3UgY2FuIHVzZSBlaXRoZXI+PiB3aW5kb3cub3Blbih1cmkpO1xyXG5cdC8vIGJ1dCB0aGlzIHdpbGwgbm90IHdvcmsgaW4gc29tZSBicm93c2Vyc1xyXG5cdC8vIG9yIHlvdSB3aWxsIG5vdCBnZXQgdGhlIGNvcnJlY3QgZmlsZSBleHRlbnNpb24gICAgXHJcblxyXG5cdC8vdGhpcyB0cmljayB3aWxsIGdlbmVyYXRlIGEgdGVtcCA8YSAvPiB0YWdcclxuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xyXG5cdGxpbmsuaHJlZiA9IHVyaTtcclxuXHJcblx0Ly9zZXQgdGhlIHZpc2liaWxpdHkgaGlkZGVuIHNvIGl0IHdpbGwgbm90IGVmZmVjdCBvbiB5b3VyIHdlYi1sYXlvdXRcclxuXHRsaW5rLnN0eWxlID0gXCJ2aXNpYmlsaXR5OmhpZGRlblwiO1xyXG5cdGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZSArIFwiLmNzdlwiO1xyXG5cclxuXHQvL3RoaXMgcGFydCB3aWxsIGFwcGVuZCB0aGUgYW5jaG9yIHRhZyBhbmQgcmVtb3ZlIGl0IGFmdGVyIGF1dG9tYXRpYyBjbGlja1xyXG5cdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XHJcblx0bGluay5jbGljaygpO1xyXG5cdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XHJcbn0iXX0=
