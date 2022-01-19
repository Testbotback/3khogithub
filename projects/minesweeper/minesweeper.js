	if (window.top != window.self) {
		window.top.location = 'http://cdn.discourse.org/uploads/meta_discourse/2000/d326c07d2188da9e.gif';
	}

	$(function() {
		var gameType = 'expert';
		var zoom = '100';
		var position = 'center';
		var isNightMode = false;
		var hashParts, i;
		var minesweeper;

		if (!!location.hash && location.hash.length > 1) {
			hashParts = location.hash.substring(1).split('-');

			for (i = 0; i < hashParts.length; i++) {
				switch (hashParts[i]) {
					case 'beginner':     gameType = 'beginner';     break;
					case 'intermediate': gameType = 'intermediate'; break;
					case '150':          zoom = '150';              break;
					case '200':          zoom = '200';              break;
					case 'left':         position = 'left';         break;
					case 'night':        isNightMode = true;        break;
				}
			}
		}

		$('#' + gameType).attr('checked', true);
		$('#zoom' + zoom).attr('checked', true);
		$('#position-' + position).attr('checked', true);
		$('#nightMode').attr('checked', isNightMode);

		document.getElementById('game-container').className = 'z' + zoom;
		setPosition(position);

		if (isNightMode) {
			toggleNightMode(isNightMode);
		}

		minesweeper = new Minesweeper([
			[ 3, 18, 62],
			[ 2, 16, 56],
			[ 1, 14, 51],
			[ 1, 10, 45]
		], getOptions, setOptions);

		minesweeper.onWin = function(gameTypeId, time) {
			var mode;
			switch (gameTypeId) {
				case 1: mode = 'Beginner'; break;
				case 2: mode = 'Intermediate'; break;
				case 3: mode = 'Expert'; break;
				default: return;
			}

			var tweet = 'I just beat #MinesweeperOnline in ' + time + ' second' + (time === 1 ? '' : 's') + ' on ' + mode + ' mode!';
			$('#share-twitter').attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet)
				+ '&url=' + encodeURIComponent('https://minesweeperonline.com') + '&hashtags=MinesweeperOnline');

			var fbSummary = tweet.replace('#MinesweeperOnline', 'Minesweeper Online');
			$('#share-facebook').attr('href', 'https://www.facebook.com/sharer/sharer.php'
				+ '?u=' + encodeURIComponent('https://minesweeperonline.com')
				+ '&quote=' + encodeURIComponent(fbSummary)
				+ '&hashtag=' + encodeURIComponent('#MinesweeperOnline'));

			$('#share-text').text(tweet + ' https://minesweeperonline.com');
			$('#share').fadeIn();
		};

		minesweeper.onNewHighScore = function(intervalTypeId) {
			$('#scores-panes').load('scores-panes.php?interval=' + intervalTypeId + '&r=' + Math.random());
			if (intervalTypeId === 1) $('#daily-link').click();
			if (intervalTypeId === 2) $('#weekly-link').click();
			if (intervalTypeId === 3) $('#monthly-link').click();
			if (intervalTypeId === 4) $('#alltime-link').click();
		};

		minesweeper.newGame();
		setHash();

		$("#options-link, #options-close").click(function() {
			$("#options").toggle();
			$("#display").hide();
			$("#controls").hide();
			$("#import").hide();
			$("#export").hide();
		});

		$("#options-form").submit(function(e) {
			$("#options").hide();
			minesweeper.newGame();
			setHash();
			e.preventDefault();
		});

		$("#display-link, #display-close").click(function() {
			$("#options").hide();
			$("#display").toggle();
			$("#controls").hide();
			$("#import").hide();
			$("#export").hide();
		});

		$('input[name="zoom"]').change(function() {
			var zoom = parseFloat($(this).val());
			minesweeper.resize(zoom);
			setHash();
		});

		$('input[name="position"]').change(function() {
			setPosition($(this).val());
			setHash();
		});

		$('input[name="nightMode"]').change(function() {
			var isNightMode = $(this).is(':checked');
			toggleNightMode(isNightMode);
			setHash();
		});

		$("#controls-link, #controls-close").click(function() {
			$("#options").hide();
			$("#display").hide();
			$("#controls").toggle();
			$("#import").hide();
			$("#export").hide();
		});

		$("#import-link, #import-close").click(function() {
			$("#options").hide();
			$("#display").hide();
			$("#controls").hide();
			$("#import").toggle();
			$("#export").hide();

			if ($('#import').is(':visible')) {
				$('#import input[type=submit]').prop('disabled', true);
				// trigger propertychange so "load game" button becomes enabled/disabled as needed
				$('#import textarea').select().trigger('propertychange');
			}
		});

		$('#import textarea').bind('input propertychange', function() {
			var isImportable = minesweeper.isImportable($.trim($(this).val()));
			$('#import input[type=submit]').prop('disabled', !isImportable);
		});

		$("#import-form").submit(function(e) {
			$("#import").hide();
			minesweeper.import_($.trim($('#import textarea').val()));
			e.preventDefault();
		});

		$("#export-link, #export-close").click(function() {
			$("#options").hide();
			$("#display").hide();
			$("#controls").hide();
			$("#import").hide();
			$("#export").toggle();

			if ($('#export').is(':visible')) {
				$('#export textarea').val(minesweeper.export_()).select();
				var didCopySucceed = document.execCommand('copy');
				$('#export-message').text(didCopySucceed ? 'Game state copied to your clipboard!' : 'Copy game state to your clipboard:');
				$('#export-first-click-message').toggle(!minesweeper.hasStartedPlaying());
			}
		});

		$('#export textarea').mousedown(function () {
			// If the textarea already has focus, don't override default behavior.
			if (document.activeElement === $(this)[0]) {
				return;
			}
			// Defer or else the ensuing click event will un-highlight.
			var that = this;
			setTimeout(() => {
				$(that).select();	
			}, 0);
		});

		$(document).keydown(function(e) {
			if (e.keyCode == 27) { //escape
				$("#options, #display, #controls, #import, #export").hide();
			}
		});

		$(".scores-tab").click(function() {
			var id = this.id;
			$(".scores-tab-selected").removeClass("scores-tab-selected");
			$(this).addClass("scores-tab-selected");
			$(".scores-pane").hide();
			$("#" + id.substring(0, id.length - 5)).show();
		});

		$('#share-close').click(function() {
			$('#share').fadeOut();
		});

		$('#share-twitter, #share-facebook').click(function(e) {
			//https://dev.twitter.com/docs/intents
			var width = 550;
			var height = 420;
			var winWidth = screen.width;
			var winHeight = screen.height;
			var left = Math.round((winWidth / 2) - (width / 2));
			var top = 0;
			if (winHeight > height) {
				top = Math.round((winHeight / 2) - (height / 2));
			}
			window.open($(this).attr('href'), 'share', 'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=' + width + ',height=' + height + ',left=' + left + ',top=' + top);
			e.preventDefault();
		});

		function setPosition(position) {
			if (position == 'left') {
				$('.outer-container').css('text-align', 'left' );
				$('body').css('margin-left', '20px');
			}
			else if (position == 'center') {
				$('.outer-container').css('text-align', 'center');
				$('body').css('margin-left', '0px');
			}
		}

		function toggleNightMode(isOn) {
			$('body').toggleClass('night-mode', isOn);
		}

		function getOptions() {
			var gameTypeId;
			var numRows;
			var numCols;
			var numMines;
			var zoom;

			if ($("#beginner").attr("checked")) {
				gameTypeId = 1;
				numRows = 9;
				numCols = 9;
				numMines = 10;
			}
			else if ($("#intermediate").attr("checked")) {
				gameTypeId = 2;
				numRows = 16;
				numCols = 16;
				numMines = 40;
			}
			else if ($("#expert").attr("checked")) {
				gameTypeId = 3;
				numRows = 16;
				numCols = 30;
				numMines = 99;
			}
			else if ($("#custom").attr("checked")) {
				gameTypeId = 0;

				numRows = parseInt($("#custom_height").val(), 10);
				if (isNaN(numRows)) {
					numRows = 20;
				}
				numRows = Math.max(1, numRows);
				numRows = Math.min(99, numRows);
				$("#custom_height").val(numRows);

				numCols = parseInt($("#custom_width").val(), 10);
				if (isNaN(numCols)) {
					numCols = 30;
				}
				numCols = Math.max(8, numCols);
				numCols = Math.min(99, numCols);
				$("#custom_width").val(numCols);

				numMines = parseInt($("#custom_mines").val(), 10);
				if (isNaN(numMines)) {
					numMines = Math.round(numRows * numCols / 5);
				}
				numMines = Math.max(0, numMines);
				numMines = Math.min(numRows * numCols - 1, numMines);
				$("#custom_mines").val(numMines);
			}

			zoom = parseFloat($('input[name="zoom"]:checked').val());

			return {
				gameTypeId: gameTypeId,
				numRows: numRows,
				numCols: numCols,
				numMines: numMines,
				zoom: zoom
			};
		}

		function setOptions(options) {
			switch (options.gameTypeId) {
				case 1: $('#beginner').prop('checked', true); break;
				case 2: $('#intermediate').prop('checked', true); break;
				case 3: $('#expert').prop('checked', true); break;
				default:
					$('#custom').prop('checked', true);
					$('#custom_height').val(options.numRows);
					$('#custom_width').val(options.numCols);
					$('#custom_mines').val(options.numMines);
					break;
			}
		}

		function setHash() {
			var gameType = 'expert';
			var zoom = $('input[name="zoom"]:checked').val();
			var position = $('input[name="position"]:checked').val();
			var isNightMode = $('input[name="nightMode"]').is(':checked');
			var hashParts = [];

			if ($("#beginner").attr("checked")) {
				hashParts.push("beginner");
			}
			else if ($("#intermediate").attr("checked")) {
				hashParts.push("intermediate");
			}

			if (zoom != 1) {
				hashParts.push(zoom * 100);
			}

			if (position != "center") {
				hashParts.push(position);
			}

			if (isNightMode) {
				hashParts.push('night');
			}

			if (hashParts.length > 0) {
				location.hash = '#' + hashParts.join('-');
			}
			else {
				location.hash = '';
			}
		}
	});
