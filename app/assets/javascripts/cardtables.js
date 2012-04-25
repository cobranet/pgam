var P = {
    taken_positions:  {
	left: { x: 20,y: 40},
	right:{ x: 680, y: 40},
	player: { x: 40, y:300 }
    },
    play_positions: {
	left: { x: 300,y: 100},
	right:{ x: 600, y: 100},
	player: { x: 400, y:150 }
    },
    others: { yoffset : 20,
	      left: { card_num: 10, 
		      x: 20, 
		      y: 40,
		      ppos: { x: 20, y: 40},
		      epos: { x: 250, y: 100}
		    } ,
	      right: { card_num: 10, 
		       x: 680, 
		       y: 40,
		       ppos: { x:680, y: 40},
		       epos: { x:475, y:100}
		     }
	    },
    table_size : { w:800, h:400 },
    card_size: { w:72,h:96 },
    yselection_off: 30,
    player_deck_pos : { x:40,y:300},
    player_deck_x_off: 30,
    player_deck: [],
    init: function(){
	// set play positons according table and card size
	P.play_positions.player.x = (P.table_size.w-P.card_size.w)/2;
    },
    get_table: function(){
	return $('#table');
    },
    get_card: function(str){
	return $('#'+str);
    },
    /* play from player hand */
    player_play: function(c){
	c.removeClass("pcard"); // not anymore player card
	c.removeClass("selected"); // nor selected
	c.addClass("playcard"); // now is playcard
	c.animate( {  left: P.play_positions.player.x,
	              top: P.play_positions.player.y
		   },300);
	P.remove_from_player(c.attr("id"));
	P.rearange_player_deck();
    },
    click: function(){
	var c = $(this);
	var id = c.attr("id");
	if ( c.hasClass("selected") ){
	    P.player_play(c);
	}
	else {
	    P.move_up(id);
	}
    },
    // removing one card from other player deck
    remove_one_from_others: function(other_str){
	elems = $("." + other_str + "card:last").remove();
    },
    trick_to_player: function(who_string){
	pos = P.play_positions[who_string]
        $ (".playcard").animate({top:pos.y, left:pos.x},1000,null,
				function(){P.clear_table();}
			       );
    },
    rearange_player_deck: function(){
	var c;
	P.set_player_deck_x();
	for ( var i = 0; i < P.player_deck.length ; i++){
	    c = $("#" + P.player_deck[i] + ".pcard");
	    c.css('left',P.player_deck_pos.x+i*P.player_deck_x_off);
	}
    },
    show_card: function(str,x,y,z,cls){
        var c = P.get_card(str).clone();
        c.removeClass("hide");
        c.addClass(cls);
        c.css('left',x);
	c.css('top', y);
	c.css('z-index',z);
	c.appendTo("#sto");
	c.click(P.click);
	
    },
    /* select card and move up */
    move_up: function(str){
	var selector = "#"+str+".pcard";
        var c=$(selector);
        if (c.hasClass("selected") == false && c.hasClass("playable") ) {
	    P.deselect_pcard();
	    c.addClass("selected");
	    c.animate({ top: "-="+P.yselection_off },300);
	}
    },
    /* deselect card and move down */
    move_down: function(str){
	var selector = "#"+str+".pcard";
	var c=$(selector);
	c.removeClass("selected");
	c.animate({top: "+="+P.yselection_off},300);
    },
    /* deselect and move down previosly selected card  */
    deselect_pcard: function(str){
	var selected = $(".selected");
        if (selected) {
	   P.move_down(selected.attr("id"));
	}
    },
    remove_from_player: function(str){
	var idx =  P.player_deck.indexOf(str); // Find the index
	if( idx != -1 ) {
	    P.player_deck.splice(idx, 1); // remove
	}
    },
    /* u zavisnosti od broja karata setuje P.player_deck_pos.x */
    set_player_deck_x: function(){
	var s = P.player_deck.length;
        var deck_w = P.card_size.w + P.player_deck_x_off*(s-1);
        P.player_deck_pos.x =  (P.table_size.w-deck_w)/2;   
    },
    /* returning jquery element of card from id from player cards */
    get_player_card: function (str){
	return $("#" + str + ".pcard");
    },
    /* seting which player cards is playable from array of ids */
    set_playables: function (arr){
	for (var i=0; i < arr.length; i++){
	    P.get_player_card(arr[i]).addClass("playable");
	}
    },	
    /* incijalno crtanje decka igraca */
    show_player_deck: function(){
        P.set_player_deck_x();
	for (var i =0; i< P.player_deck.length; i++){
	    P.show_card( P.player_deck[i],
			 P.player_deck_pos.x+i*P.player_deck_x_off,
			 P.player_deck_pos.y,
			 i,
		         "pcard");
	}
    },
    get_other: function(other_str){
	if ( other_str == 'left' ) {
	    return P.others.left;
	}
	else {
	    return P.others.right;
	};
    },
    show_other_deck: function(other){
        var player = P.get_other(other);	
        for ( var i=0; i < player.card_num; i++){
            var c = P.get_card("backh").clone();
            c.removeClass("hide");
            c.addClass( other + "card");
            c.css('left',player.x);
	    c.css('top', player.y + P.others.yoffset*i );
	    c.css('z-index',i);
	    c.appendTo("#sto");
	}
    },
    play_from_others: function(other,str){
	var player = P.get_other(other);	
	P.show_card( str,
		     player.ppos.x,
		     player.ppos.y,
		     100,
		     "playcard");	
	$("#"+str + ".playcard")
	    .animate( {  left: player.epos.x,
	                 top: player.epos.y
		      },1000);
        P.remove_one_from_others(other);  
    },
    clear_table: function(){
	$(".playcard").fadeOut('slow',
			       function(){
				   $(".playcard").remove();
			       });
	    
    }
}

$(document).ready( function() { 
    P.player_deck = ["c7C","c9C","cAC","cAD","c8H",
		     "c9H","cTH","cTS","cKS","cAS"]
    
    P.init();
    P.show_other_deck('left');
    P.show_other_deck('right');
    P.show_player_deck();
    P.set_playables(["c7C","c9C","cAC"]);
});
