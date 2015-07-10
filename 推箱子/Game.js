function Game(){
	
	this.level=[{
		map:[
			1,1,2,2,2,1,1,1,
			1,1,2,3,2,1,1,1,
			1,1,2,4,2,2,2,2,
			2,2,2,4,4,4,3,2,
			2,3,4,4,4,2,2,2,
			2,2,2,2,4,2,1,1,
			1,1,1,2,3,2,1,1,
			1,1,1,2,2,2,1,1
		],
		box:[
			{x:3,y:3},
			{x:3,y:4},
			{x:5,y:3},
			{x:4,y:5}
		],
		person:{x:4,y:4}
		
	},{
		map:[
			1,1,2,2,2,2,1,1,
			1,1,2,3,3,2,1,1,
			1,2,4,4,3,2,2,1,
			1,2,4,4,4,3,2,1,
			2,2,4,4,4,4,2,2,
			2,4,4,2,4,4,4,2,
			2,4,4,4,4,4,4,2,
			2,2,2,2,2,2,2,2
		],
		box:[
			{x:4,y:3},
			{x:3,y:4},
			{x:4,y:5},
			{x:5,y:5}
		],
		person:{x:3,y:6}
	},{
		map : [
				1,1,1,1,2,2,2,2,2,2,2,1,
				1,1,1,1,2,4,4,2,4,4,2,1,
				1,1,1,1,2,4,4,4,4,4,2,1,
				2,2,2,2,2,4,4,2,4,4,2,1,
				3,3,3,2,2,2,4,2,4,4,2,2,
				3,4,4,2,4,4,4,4,2,4,4,2,
				3,4,4,4,4,4,4,4,4,4,4,2,
				3,4,4,2,4,4,4,4,2,4,4,2,
				3,3,3,2,2,2,4,2,4,4,2,2,
				2,2,2,2,2,4,4,4,4,4,2,1,
				1,1,1,1,2,4,4,2,4,4,2,1,
				1,1,1,1,2,2,2,2,2,2,2,1
			],
			box : [
				{x : 5 , y : 6},
				{x : 6 , y : 3},
				{x : 6 , y : 5},
				{x : 6 , y : 7},
				{x : 6 , y : 9},
				{x : 7 , y : 2},
				{x : 8 , y : 2},
				{x : 9 , y : 6},
			],
			person : { x : 5 , y : 9 }
	}];
	
	
}

Game.prototype={
	
	//游戏的初始化方法
	init:function(op){
		
		this.op=op;
		
		this.inow=0; //当前关数
		
		this.drawMap();

		
	},
	
	//绘制地图方法
	drawMap:function(){
		
		this.op.empty();
		
		document.title = '第'+(this.inow+1)+'关';
		
		this.op.css("width",Math.sqrt(this.level[this.inow].map.length)*50);
		
		this.curr=this.level[this.inow];
		
		$.each(this.curr.map,$.proxy(function(i,item){
			this.op.append($("<div class='bg"+item+"'></div>"));
		},this));
		
		this.drawBox();
		
		this.drawPerson();
		
		this.showScore();
		
	},
	
	//在地图上绘制箱子
	drawBox:function(){
		
		$.each(this.curr.box,$.proxy(function(i,item){
			
			var box=$('<div class="box"></div>');
			
			box.css('top',item.y*50);
			box.css('left',item.x*50);
			
			this.op.append(box);
			
		},this));
		
	},
	
	//在地图上绘制人物
	drawPerson:function(){
		
		var person=$('<div class="person"></div>');
		
		person.css('top',this.curr.person.y*50);
		person.css('left',this.curr.person.x*50);
		
		person.data('x',this.curr.person.x);
		person.data('y',this.curr.person.y);
		
		this.op.append(person);
		
		this.bindOperate(person);
		
	},
	
	//给任务添加键盘事件
	bindOperate:function(person){
		$(document).keydown($.proxy(function(event){

			switch(event.which){
				case 37://←
					
					person.css('backgroundPosition','-150px 0');
					this.movePerson(person,{x:-1});

				break;
					
				case 38://↑
				
					person.css('backgroundPosition','0 0');
					this.movePerson(person,{y:-1});
					
				break;
					
				case 39://→
					person.css('backgroundPosition','-50px 0');
					this.movePerson(person,{x:1});
					
				break;
				
				case 40://↓
				
					person.css('backgroundPosition','-100px 0');
					this.movePerson(person,{y:1});
					
				break;
				
			}
			
		},this));
		
	},
	
	movePerson:function(person,moveOpt){
		
		var moveX=moveOpt.x||0;
		var moveY=moveOpt.y||0;
		
		var nextPos=(person.data('y')+moveY)*Math.sqrt(this.curr.map.length)+person.data('x')+moveX;
		
		if(this.curr.map[nextPos]!=2){
			
			person.css('top',(person.data('y')+moveY)*50);
			person.css('left',(person.data('x')+moveX)*50);
		
			person.data('x',person.data('x')+moveX);
			person.data('y',person.data('y')+moveY);
			
			$.each($('.box'),$.proxy(function(i,item){
				
				var boxNextPos=(person.data('y')+moveY)*Math.sqrt(this.curr.map.length)+person.data('x')+moveX;
				
				if(this.collisionCheck(person,$(item))&&this.curr.map[boxNextPos]!=2){
					
					//箱子前进
					$(item).css('top',(person.data('y')+moveY)*50);
					$(item).css('left',(person.data('x')+moveX)*50);
					
					
					$.each($('.box'),$.proxy(function(i,item2){
						
						if(this.collisionCheck($(item),$(item2))&&item!=item2){
							
							//箱子后退
							$(item).css('top',(person.data('y'))*50);
							$(item).css('left',(person.data('x'))*50);
							
							//人后退
							person.css('top',(person.data('y')-moveY)*50);
							person.css('left',(person.data('x')-moveX)*50);
					
							person.data('x',person.data('x')-moveX);
							person.data('y',person.data('y')-moveY); 
							
						}
						
					},this));
				
				}else if(this.collisionCheck(person,$(item))){
					
					person.css('top',(person.data('y')-moveY)*50);
					person.css('left',(person.data('x')-moveX)*50);
				
					person.data('x',person.data('x')-moveX);
					person.data('y',person.data('y')-moveY);
				
				}
			
			},this))
			
		}
		
		this.nextLevel();
	},
	
	collisionCheck:function(source,target){
		
		var sl=source.offset().left;//;
		var sr=source.offset().left+source.width();
		var st=source.offset().top;
		var sb=source.offset().top+source.height();
		
		var tl=target.offset().left;
		var tr=target.offset().left+target.width();
		var tt=target.offset().top;
		var tb=target.offset().top+target.height();
		
		if(sl>=tr||sr<=tl||st>=tb||sb<=tt){
			return false;
		}else{
			return true;
		} 
		
	},
	
	nextLevel:function(){
		
		var completed=0;
		
		$.each($('.box'),$.proxy(function(i,item){
			
			$.each($('.bg3'),$.proxy(function(i,item2){
				if(this.collisionCheck($(item),$(item2))){
					completed++;
					
				}
				
			},this));
			
		},this));
		
		$('.score').html("<strong>得分:"+completed+"分</strong>");
		
		if(completed==this.curr.box.length){
			this.inow++;	//当前关数
			
			if(this.inow==this.level.length){
				alert("完成所有关数");
				this.inow=0;
				this.drawMap();
				return;
			}
			this.drawMap();
		}
	},
	
	showScore:function(){
		var score=$('<div class="score"><strong>得分:</strong></div>');
		
		this.op.append(score);
		
	}
}