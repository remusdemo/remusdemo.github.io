	
	function relMouseCoords(e){
	    var mouseX, mouseY;

	    if(e.offsetX) {
	        mouseX = e.offsetX;
	        mouseY = e.offsetY;
	    }
	    else if(e.layerX) {
	        mouseX = e.layerX;
	        mouseY = e.layerY;
	    }
	    return {x:mouseX, y:mouseY}
	}
	
	function GridMap() {
	    const that = {
	        map: [],
	       	
	       	move(element, newX, newY) {
	            this.deleteValue(element.x, element.y);
	            this.update(newX, newY, element.val)
	        },

	        update(x, y, value) {
	            if (!this.map[x]) {
	                this.map[x] = [];
	            }
	            this.map[x][y] = value;
	        },

	        getValue(x, y) {
	            if (!this.map[x] || this.map[x][y] === undefined) return false;
	            return this.map[x][y];
	        },

	        deleteValue(x, y) {
	            if (this.map[x] && this.map[x][y] !== undefined) {
	                delete this.map[x][y];
	            }
	        },

	        getList() {
	            const list = [];
	            for (let i = 0; i < this.map.length; i++) {
	                const row = this.map[i];
	                if (row) {
	                    for (let j = 0; j < row.length; j++) {
	                        if (row[j] !== undefined) {
	                            list.push({ x: i, y: j, val: row[j] });
	                        }
	                    }
	                }
	            }
	            return list;
	        }
	    };
	    return that;
	}

	
	function SnakePart(x,y,dir){
		var that = {};

        that.x = x;
        that.y = y;
        that.dir = dir; // N,E,S,O
        var listPivots = []; 

        that.getFirstPivot = function() {
            if (listPivots.length>0) {
                return listPivots[0];
            } else {
                return -1;
            }
        };
        that.removeFirstPivot = function() {
            listPivots.splice(0,1);
        };
        that.addPivot = function(pivot) {
            listPivots[listPivots.length] = pivot;
        };
        that.getPivots = function() {
            return listPivots;
        };
        that.splicePivot = function(index) {
            listPivots.splice(j,1);
        };

        return that;
    }
	function Snake(n,W,H,i){
		console.log("init snake blocSize=" + n + ", w=" + W + ", h=" + H + ", size=" + i);
		var that = {};

		// private variable
		var listPart = [];
		var initSnakeSize = i;
        var size = n;
		that.appW = W;
		that.appH = H;

		// private methods
		function getLength() {
			return listPart.length;
		}

		function getDeltaPart(s)  {
			var ret = {x:0,y:0};

			ret = getDeltaDir(s);
			ret.x = -ret.x;
			ret.y = -ret.y;

			return ret;
		}

		function getDeltaDir(s)  {
			var ret = {x:0,y:0};
			if ( s == 'N' ) {
				ret.x = 0; ret.y = -size;
			} else if ( s == 'E' ) {
				ret.x = size; ret.y = 0;
			} else if ( s == 'S' ) {
				ret.x = 0; ret.y = size;
			} else if ( s == 'O' ) {
				ret.x = -size; ret.y = 0;
			}
			return ret;
		}
		
		// public methods
		that.resetApp = function(w,h) {
			that.appW = w;
			that.appH = h;
		};
		that.addParts = function(n) {
			for (i=0;i<n;i++) {

                var app = AppSnake.getAppSize();
				var newPart = SnakePart(app.w/2,app.h,'N');

				var snakeLen = getLength();
				if ( snakeLen > 0 ) {
					var lastPart = listPart[snakeLen-1];
					newPart.x = lastPart.x;
					newPart.y = lastPart.y;

					var dPos = getDeltaPart(lastPart.dir);

					newPart.x += dPos.x;
					newPart.y += dPos.y;
                    newPart.dir = lastPart.dir;

                    var newPivots = lastPart.getPivots();
                    for(j=0;j<newPivots.length;j++) {
                        var pTime = newPivots[j].time+1;
                        var pDir = newPivots[j].dir;
                        var pivot = {"time":pTime,"dir":pDir};
                        newPart.addPivot(pivot);
                    }

				}

				listPart[snakeLen] = newPart;
			}
		};
		that.move = function(time) {
		    var nbParts = getLength();
		    for (i = 0; i < nbParts; i++) {
		        var oPart = listPart[i];

		        // Is it time to change direction?
		        var partPivot = oPart.getFirstPivot();
		        if (partPivot != -1) {
		            if (partPivot.time == time) {
		                oPart.dir = partPivot.dir;
		                oPart.removeFirstPivot();
		            }
		        }

		        var dPos = getDeltaDir(oPart.dir);
		        var nX = listPart[i].x + dPos.x;
		        var nY = listPart[i].y + dPos.y;

		        // Adjust for wrapping within canvas, considering dynamic grid size
		        if (time > initSnakeSize) {
		            if (nX >= that.appW - size) nX = 0;
		            if (nX < 0) nX = that.appW - size;
		            if (nY >= that.appH - size) nY = 0;
		            if (nY < 0) nY = that.appH - size;
		        }

		        // Ensure that the snake's coordinates align with the grid (multiples of blocSize)
		        nX = Math.floor(nX / size) * size;
		        nY = Math.floor(nY / size) * size;

		        listPart[i].x = nX;
		        listPart[i].y = nY;
		    }
		};

		that.getLength = function() {
			return getLength();
		};
		that.getParts = function() {
			return listPart;
		};
		that.logSnake = function() {
            log("---- log snake ---")
			for(j=0;j<getLength();j++) {
				log("part "+j+"(x,y) :"+listPart[j].x+","+listPart[j].y+","+listPart[j].dir);
			}
		};
		that.changeHeadtDir = function(dir) {

			var sLen = getLength();
			if ( sLen>0) {
				listPart[0].dir = dir;
			}
		};
		that.getHeadPos = function() {
			var sLen = getLength();
			ret = {"x":0,"y":0};
			if ( sLen>0) {
				ret.x = listPart[0].x;
				ret.y = listPart[0].y;
			}
			return ret;
		};
		that.addPivotToParts = function(time,dir) {
			var nbParts = getLength();
			if ( nbParts>0) {
                var headPart = listPart[0];

                var doAddPivot = true;
                if ( ( headPart.dir == "N" && dir == "S" ) ||
                     ( headPart.dir == "S" && dir == "N" ) ||
                     ( headPart.dir == "E" && dir == "O" ) ||
                     ( headPart.dir == "O" && dir == "E" )
                ) {
                  doAddPivot = false;
                }
                if ( doAddPivot ) {
                    for(i=0;i<nbParts;i++) {
                        var timeP = time+i;
                        listPart[i].addPivot( {"time":timeP,"dir":dir} );
                    }
                }
			}
		};
		that.isHeadOnBody = function() {
			var nbParts = getLength();
			if ( nbParts>1) {
				var headPart = listPart[0];
				for(i=1;i<nbParts;i++) {
					var part = listPart[i];
					if ( (headPart.x == part.x) && (headPart.y == part.y) ) {
						return true;
					}
				}
			}
			return false;
		};
		that.moveBack = function() {
			var nbParts = getLength();
			if ( nbParts>0) {
				for(i=0;i<nbParts;i++) {
					var part = listPart[i];
					var dPos = getDeltaDir(part.dir);

					listPart[i].x -= dPos.x;
					listPart[i].y -= dPos.y;
				}
			}
		};
        that.hitObject = function(coord) {
            for(i=0;i<listPart.length;i++) {
				var part = listPart[i];
                if (part.x == coord.x && part.y == coord.y) {
                    return true;
                }
            }
            return false;
        };
		that.addParts(initSnakeSize);
		return that;
	}
	

	
	/* singleton to manage the game */
	const AppSnake = (function() {
		const canvas = document.getElementById("snakecontainer");
		const ctx = canvas.getContext("2d");

		let blocSize = 13;
		let gridW = 50;
		let gridH = 30;

		let infoBarEl;

		// APP INIT
		var isReady = false
		var snake;
		var isPause = false;
		var appW = blocSize * gridW;
		var appH = blocSize * gridH;
		var currentTime = 0;
		var idMove = 0;
		var sMoveAction = "";
        var cycle1000 = 0;
        var cycleMouse = 0;

        var appleList = [];
        var mouseList = [];
        var listBodyColor = ['rgb(124,213,64)','rgb(176,212,248)','rgb(62,165,248)','rgb(30,100,171)','rgb(246,165,245)'
        ,'rgb(249,102,176)','rgb(241,49,49)'];
        var nbBodyColor = listBodyColor.length;

        var NB_BASE_LEVEL = 5;
        var pendingParts = 0;
        var nbAppleEaten = 0;
        var nbMouseEaten = 0;
        var INIT_SPEED = 150
		var actionSpeed = 0;
        var numLevel = 1;
        var isGameOver = false;
        
        var appleMap = new GridMap();
        var mouseMap = new GridMap();
        
        var arrowSize = 160;
        var controlPos = {
			u:{x:appW/2-arrowSize/2,y:20} , 
			r:{x:appW-20-arrowSize,y:appH/2-arrowSize/2} , 
			d:{x:appW/2-arrowSize/2,y:appH-20-arrowSize} , 
			l:{x:20 ,y:appH/2-arrowSize/2} 
        };

		//private functions
        function initCanvas() {
        	$("#snakecontainer").attr("width", appW).attr("height", appH);
        	snake.resetApp(appW,appH);
        }
		function actionMove() {
			if (!isPause) onActionMove();
		}
		function onActionMove() {

			cycleMouse ++;
            cycle1000 ++;

            var endCycleMouse = Math.floor(350/actionSpeed);
            var endCycle1000 = Math.floor(1000/actionSpeed);

            // every second
            if ( cycle1000 == endCycle1000  ) {

                cycle1000 = 0;

                if (Math.floor(Math.random() * 100) < 20) {
					addRandomApple();
                }

                if (Math.floor(Math.random() * 100) < 5) {
					addRandomMouse();
                }
            }

            // every 250ms
			if ( cycleMouse == endCycleMouse  ) {
				cycleMouse = 0;
				// move mice
				drawMouseMap();
			}

            // clear all
            ctx.clearRect(0, 0, appW, appH);
            
			if (sMoveAction != "") {
				snake.addPivotToParts(currentTime, sMoveAction);
				sMoveAction = "";
			}

            // move snake
            snake.move(currentTime);
            currentTime ++;

            // check for game over
            var hPos = snake.getHeadPos();

			// hit a wall
            /*if ( hPos.x >= appW || hPos.x < 0 ||
				hPos.y >= appH || hPos.y < 0 ) {
                GameOver();snake.moveBack();isGameOver = true;
            }*/

            // eat myself ?
            if (!isGameOver) {
                if ( snake.isHeadOnBody() ) {
                    GameOver();
                }
            }

            if (!isGameOver) {
                // eat an apple ?

            	let snakeX = hPos.x;
            	let snakeY = hPos.y;

                let appleFound = appleMap.getValue(snakeX, snakeY);
            	if (appleFound) {
            		onAppleEaten();
            		appleMap.deleteValue(snakeX, snakeY);
            	}
            	
            	let mouseFound = mouseMap.getValue(snakeX, snakeY);
            	if (mouseFound) {
            		onMouseEaten();
            		mouseMap.deleteValue(snakeX, snakeY);
            	}
            	
                // grow a part ?
                if ( pendingParts > 0 ) {
                    snake.addParts(1);
                    pendingParts -= 1;
                }
            }
            
            showGame();
		}
		function showGame() {
            showControls()	
            drawMouseMap();
            drawAppleMap();
            showSnake();
		}
		function drawAppleMap() {
			var a = appleMap.getList();
			for (var i = 0; i < a.length; i++) {
				var o = a[i];
				drawApple({"x":o.x,"y":o.y});
			}
		}

		function drawMouseMap() {
		    // Get the list of mice from mouseMap
		    var mice = mouseMap.getList();

		    // Loop through all mice in the list
		    mice.forEach(function(mouse) {
		        // Draw each mouse at its current position
		        drawMouse(mouse);

		        // 20% chance not to move
		        if (getRandom(1,5)>1) return;

		        // Move the mouse randomly within a certain range (you can tweak this range)
		        var moveX = getRandom(-1, 1) * blocSize;  // Random X movement (within blocSize)
		        var moveY = getRandom(-1, 1) * blocSize;  // Random Y movement (within blocSize)

		        // Update the mouse's position
		        let newX = mouse.x + moveX;
		        let newY = mouse.y + moveY;

		        // Optional: Ensure the mouse stays within canvas bounds (avoid going out of bounds)
		        newX = Math.max(0, Math.min(canvas.width - blocSize, newX));
		        newY = Math.max(0, Math.min(canvas.height - blocSize, newY));

		        mouseMap.move(mouse, newX, newY);

		    });
		}



        function onMouseEaten() {
            pendingParts += 4; // number of snake parts to add
            nbMouseEaten += 1; 
            checkLevel();
        }
        function onAppleEaten() {
            pendingParts += 1; // number of snake parts to add
            nbAppleEaten += 1;
            checkLevel();
        }

        function checkLevel() {
            var nextLevel = NB_BASE_LEVEL * Math.pow(numLevel,2);

            var testLevel = nbAppleEaten + nbMouseEaten * 4;
            if (testLevel >= nextLevel) {
                numLevel += 1;
                restartMove(actionSpeed - 10);
                infoBarEl.innerHTML = "Level " + numLevel;
            }
        }
		function initMove() {
			if (idMove == 0) {
				idMove = setInterval(actionMove, actionSpeed);
				return idMove;
			}
		}

        function restartMove(n) {
            clearInterval(idMove); idMove = 0;
            actionSpeed = n;
            initMove();
        }

		function showSnake() {
			var snakeParts = snake.getParts();
			for(j=snakeParts.length-1;j>=0;j--) drawSnakePart(j,snakeParts[j]) ;
		}

        function getRotationObj(rot,x,y,imgW,imgH) {

            var cw = imgW, ch = imgH, cx = 0, cy = 0;

            if ( rot == 90 ) {
                cx = 0+y;
                cy = (imgH + x)*-1;
                cw = imgW;
                ch = imgH;
            }else if (rot == 180) {
                cx = (imgW + x)* -1;
                cy = (imgH + y)* -1;
            }else if (rot == 270) {
                cw = imgW;
                ch = imgH;
                cx = (imgW+y) * -1;
                cy = 0 + x;
            }

            return {"x":cx,"y":cy,"w":cw,"h":ch};
        }
        function drawSnakePart(j,part) {

            if (j == 0 ) {
				drawHead(part);
            } else {
                drawPartBody(part);
            }
        }
		function drawHead(part) {
			drawSquare(part,"#1D9D41");
		}

        function drawPartBody(part) {
            var iColor = Math.min(nbBodyColor,numLevel)
            drawSquare(part,listBodyColor[iColor]);
        }
        function drawSquare(coord,color) {
            ctx.fillStyle = color;
            ctx.fillRect(coord.x,coord.y,blocSize,blocSize)
            ctx.fill();
        }
        function addRandomApple(){
        	
        	if (appleMap.getList().length > 19) {
        		console.log("apple maxed out....")
        		return;
        	}

            var Ax = getRandom(0, gridW-1) * blocSize;
            var Ay = getRandom(0, gridH-1) * blocSize;
            var coord = {"x":Ax,"y":Ay};
        	

            if (!snake.hitObject(coord) && !appleMap.getValue(Ax,Ay) ) {
        		console.log("apple x=" + Ax + ", y="+ Ay);
            	appleMap.update(Ax, Ay, "apple");
                drawApple(coord);
            }
        }

        function addRandomMouse(){
			if (mouseMap.length > 4 ) {
				console.log("mouse maxed out...")
				return;
			}

            Ax = getRandom(0, gridW-1) * blocSize;
            Ay = getRandom(0, gridH-1) * blocSize;
            var coord = {"x":Ax,"y":Ay};
            
            if (!snake.hitObject(coord) && !appleMap.getValue(Ax,Ay) ) {
        		console.log("apple x=" + Ax + ", y="+ Ay);
            	mouseMap.update(Ax, Ay, "mouse");
                drawMouse(coord);
            }
        }

        function getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function drawAppleList() {
            for (i=0; i < appleList.length; i++) {
            	drawApple(appleList[i]);
            }
        }
        function drawApple(coord) {
            var img = Globals.Loader.getAsset('apple');
            ctx.drawImage(img,coord.x-blocSize/3,coord.y-blocSize/3,blocSize*1.5,blocSize*1.5);
        }

		function drawMouse(coord) {
			let asset  = getRandom(0,1) > 0 ? 'mouse1' : 'mouse2';
		    var img = Globals.Loader.getAsset(asset);

		    // Random rotation between -10 and 10 degrees for a lively effect
		    var rotation = getRandom(-10, 10);

		    if (getRandom(0,3) > 0) {
				rotation += 190;
			}

		    // Draw the mouse with a random rotation
		    ctx.save();
		    ctx.translate(coord.x + blocSize / 2, coord.y + blocSize / 2); // Move to the center of the mouse
		    ctx.rotate(rotation * Math.PI / 180); // Rotate the mouse by a random amount
		    ctx.drawImage(img, -blocSize / 3, -blocSize / 3, blocSize * 1.5, blocSize * 1.5); // Draw the mouse
		    ctx.restore();
		}



		function logSnake() {
			snake.logSnake();
		}

		function startPause() {
			if ( !isReady ) return; 

			if (currentTime == 0) {
				AppSnake.startGame();
				return;
			}
			isPause = !isPause;
			console.log("new isPause value=" + isPause);
		}
		function GameOver() {
			clearInterval(idMove);

			idMove = 0;
			currentTime = 0;
            isGameOver = true;

			var img = Globals.Loader.getAsset('gameover');
			
            var iX = (appW-img.width)/2;
            var iY = (appH-img.height)/2;

			ctx.save();
			ctx.globalAlpha = 0.3;
			ctx.drawImage(img,iX,iY,img.width,img.height);
			ctx.restore();

		}

		function showControls() {
		  const img = Globals.Loader.getAsset('arrowup');
		  const pos = controlPos;

		  ctx.globalAlpha = 0.3;

		  // Helper function to draw rotated arrows (Right, Down, Left)
		  function drawRotatedArrow(rotation, pos) {
		    const rO = getRotationObj(rotation, pos.x, pos.y, arrowSize, arrowSize);
		    ctx.save();
		    ctx.rotate(rotation * Math.PI / 180);
		    ctx.drawImage(img, rO.x, rO.y, rO.w, rO.h);
		    ctx.restore();
		  }

		  // Draw the arrows (no rotation for Up arrow)
		  ctx.drawImage(img, pos.u.x, pos.u.y, arrowSize, arrowSize);   // Up
		  drawRotatedArrow(90,  pos.r);  // Right
		  drawRotatedArrow(180, pos.d);  // Down
		  drawRotatedArrow(270, pos.l);  // Left

		  ctx.globalAlpha = 1;
		}


		function positionControlsForMobile() {
		  if (!isMobile()) return;

		  const centerX = canvas.width / 2;
		  const bottomY = canvas.height - arrowSize * 2.5;

		  // Dynamic offsets based on arrowSize
		  const verticalOffset = arrowSize * 0.8;  // Adjust vertical space for up/down arrows
		  const horizontalOffsetLeft = arrowSize * 1.5;  // Adjust horizontal space for left arrow
		  const horizontalOffsetRight = arrowSize * 0.5;  // Adjust horizontal space for right arrow

		  // Position vertical arrows (Up and Down)
		  controlPos.u = { x: centerX - arrowSize / 2, y: bottomY - verticalOffset };  // Up
		  controlPos.d = { x: centerX - arrowSize / 2, y: bottomY + verticalOffset };  // Down

		  // Position horizontal arrows (Left and Right)
		  controlPos.l = { x: centerX - horizontalOffsetLeft, y: bottomY };  // Left
		  controlPos.r = { x: centerX + horizontalOffsetRight, y: bottomY };  // Right
		}


		function getNewDirection(currentDir, turn) {
			const turnMap = {
				'N': { left: 'O', right: 'E' },
				'S': { left: 'E', right: 'O' },
				'E': { left: 'N', right: 'S' },
				'O': { left: 'S', right: 'N' }
			};
			return turnMap[currentDir][turn];
		}

		function getTouchTurn(x, y) {
			const size = arrowSize;

			const inside = (pos) =>
				x >= pos.x && x <= pos.x + size &&
				y >= pos.y && y <= pos.y + size;

			if (inside(controlPos.l)) return "left";
			if (inside(controlPos.r)) return "right";

			return null;
		}


		function changeDirection(newDir) {
			if (newDir && sMoveAction == "") sMoveAction = newDir; 
		}

		function isMobile() {
		  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
		}

		function resizeForMobile() {
			blocSize = Math.floor(window.innerWidth / 24);
			arrowSize = Math.floor(window.innerWidth / 4);
			const availableWidth = window.innerWidth - 40;
			const availableHeight = window.innerHeight - 120;

			// Compute how many cells fit
			gridW = Math.floor(availableWidth / blocSize);
			gridH = Math.floor(availableHeight / blocSize);

			// Set canvas size
			canvas.width = gridW * blocSize;
			canvas.height = gridH * blocSize;

			appW = blocSize * gridW;
			appH = blocSize * gridH;

			let infoBar = document.getElementById("info-bar");
			let restartBtn = document.getElementById("restart-btn");
	        infoBar.style.fontSize = '32px';
	        infoBar.style.padding = '12px';

	        restartBtn.style.fontSize = '32px';
	        restartBtn.style.padding = '12px';

			positionControlsForMobile();
		}

		return {
			getCanvas: function() {
				return canvas;
			},
			appReady : function () {
				isReady = true;
				infoBarEl = document.getElementById("info-bar");

				if (isMobile()) {
					console.log("isMobile");
					resizeForMobile();
				} else {
					console.log("default size");
					$("#snakecontainer").attr("width", appW).attr("height", appH);
				}

			},
			startGame: function() {

				isGameOver = false;

                appleList = [];
                mouseList = [];
                
				appleMap = new GridMap();
				mouseMap = new GridMap();

				ctx.clearRect(0, 0, appW, appH);

                // init game variables
                isPause = false;
                actionSpeed = INIT_SPEED;
				cycle1000 = 0;
				cycleMouse = 0;
                numLevel = 1;
                nbAppleEaten = 0;
                nbMouseEaten = 0;
                pendingParts = 0;
				sMoveAction = "";
				currentTime = 0;

                // init menu
                $("#snakemenu .nbapple").html("<p>0</p>");
                $("#snakemenu .nbmouse").html("<p>0</p>");

                // init snake
                snake = Snake(blocSize,appW,appH,6);
                addRandomApple();
                addRandomMouse();
                
                initCanvas();

				initMove();
				showGame();
			},
			onTouchStart: function(e) {
				e.preventDefault();
				const touch = e.touches[0];
				const rect = canvas.getBoundingClientRect();
				const touchX = touch.clientX - rect.left;
				const touchY = touch.clientY - rect.top;

				const turn = getTouchTurn(touchX, touchY);
				if (turn) {
					const headDir = snake.getParts()[0].dir;
					const newDir = getNewDirection(headDir, turn);
					changeDirection(newDir);
				}
			},
			onKeyDown: function(evt) {
				
				// arrows key : 38, 39, 40, 37
				// WASD : 87, 68, 83, 65

				var sDir = null;
				if		(evt.keyCode == 87) sDir = 'N';
				else if (evt.keyCode == 68) sDir = 'E';
				else if (evt.keyCode == 83) sDir = 'S';
				else if (evt.keyCode == 65) sDir = 'O';
				
				else if	(evt.keyCode == 38) sDir = 'N';
				else if (evt.keyCode == 39) sDir = 'E';
				else if (evt.keyCode == 40) sDir = 'S';
				else if (evt.keyCode == 37) sDir = 'O';
				else if (evt.keyCode == 32) startPause();
				else if (evt.key == "x") {
					let hPos = snake.getHeadPos();
					console.log("snakeHead x=" + hPos.x + ", y="+hPos.y);
				}
				else if (evt.key == "b") {
					let a = appleMap.getList();
					for (var i = 0; i < a.length; i++) {
						var o = a[i];
						console.log(i + ", x=" + o.x + ",y=" + o.y);
					}
				}
				else if (evt.key == "n") {
					let a = mouseMap.getList();
					for (var i = 0; i < a.length; i++) {
						var o = a[i];
						console.log(i + ", x=" + o.x + ",y=" + o.y);
					}
				}

				changeDirection(sDir);
			},
            getAppSize:function() {
              return {"w":appW,"h":appH};
            }
		};
		
	})();


	var Loader;

	Loader = (function() {

	  function Loader() {
	    this.progress = 0;
	    this.assets = {};
	    this.totalAssets = 0;
	    this.loadedAssets = 0;
	  }

	  Loader.prototype.load = function(assets) {
	    var asset, name, _results;
	    _results = [];
	    for (name in assets) {
	      asset = assets[name];
	      _results.push(this.loadAsset(name, asset));
	    }
	    return _results;
	  };

	  Loader.prototype.loadProgress = function(func) {
	    return this.onprogress = func;
	  };

	  Loader.prototype.loadComplete = function(func) {
	    return this.onload = func;
	  };

	  Loader.prototype.updateProgress = function() {
	    this.progress = this.loadedAssets / this.totalAssets;
	    if (this.onprogress) this.onprogress(this.progress);
	    if (this.progress === 1 && this.onload) return this.onload();
	  };

	  Loader.prototype.loadAsset = function(name, asset) {
	    var basePath, img, loader;
	    img = new Image();
	    loader = this;
	    img.onload = function() {
	      this.loaded = true;
	      loader.loadedAssets++;
	      return loader.updateProgress();
	    };
	    this.assets[name] = {
	      loader: this,
	      src: asset,
	      image: img
	    };
	    this.totalAssets++;
	    basePath = window && window.basePath ? window.basePath : '';
	    return img.src = basePath + asset;
	  };

	  Loader.prototype.getAsset = function(name) {
	    return this.assets[name]['image'];
	  };

	  return Loader;

	})();

	var Globals;

	Globals = {
	  Loader: new Loader()
	};
	

	// do something when all your images are loaded ... 
	Globals.Loader.loadComplete(function(progress) {
	    console.log(" app ready");
	    $("#controls").show();
	    AppSnake.appReady();
	    AppSnake.startGame();

	    const canvas = AppSnake.getCanvas();
		canvas.addEventListener("click", () => canvas.focus());
		canvas.addEventListener("touchstart", () => canvas.focus());

		document.addEventListener("keydown", function(e) {
			console.log("keydown");
		    AppSnake.onKeyDown(e);
		});

		document.getElementById("restart-btn").addEventListener("click", function() {
		  AppSnake.startGame();
		});

		canvas.addEventListener("touchstart", (e) => {
			AppSnake.onTouchStart(e);
		});

		const restartBtn = document.getElementById("restart-btn");
		restartBtn.addEventListener("click", AppSnake.startGame);
		restartBtn.addEventListener("touchstart", AppSnake.startGame);

	});




	var Constants;

	Constants = {
	    ASSETS: {
	        snakehead: 'snakehead.png',
	        mouse1: 'mouse1.png',
	        mouse2: 'mouse2.png',
	        apple: 'apple.png',
	        arrowup: 'arrowup.png',
	        gameover: 'game_over.jpg',
	    }
	}
	Globals.Loader.load(Constants.ASSETS);
	