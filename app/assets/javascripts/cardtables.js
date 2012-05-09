var P = {
    players: {   left: {   play: { x: 20, y: 40 },
			   endpos: { x: 250, y: 100},
			   card_num: 10,
			   yoffset: 20
		       },
		 right: { play: { x: 680, y: 40 },
			  endpos: { x: 475, y: 100},
			  card_num: 10,
			  yoffset: 20,
			},
		 player: { play: { x: 400, y: 150 },
			   deck_pos: {x: 40, y: 300}
			 }
               },
    others: { yoffset : 20,
	      left: { card_num: 10,
		      x: 20,
		      y: 40,
		      ppos: { x: 20, y: 40},
		      epos: { x: 250, y: 100}
		    },
	      right: { card_num: 10,
		       x: 680,
		       y: 40,
		       ppos: { x: 680, y: 40},
		       epos: { x: 475, y: 100}
		     }
	    },
    table_size : { w: 800, h: 400 },
    card_size: { w: 72, h: 96 },
    yselection_off: 30,
    player_deck_x_off: 30,
    player_deck: [],
    // set play players according table and card size
    init: function () {
        P.players.player.play.x = (P.table_size.w-P.card_size.w)/2;
    },
    get_table: function () {
        return $('#table');
    },
    get_card: function (str) {
        return $('#'+str);
    },
    /* play from player hand */
    player_play: function (c) {
        c.removeClass("pcard"); // not anymore player card
        c.removeClass("selected"); // nor selected
        c.addClass("playcard"); // now is playcard
        c.animate({  left: P.players.player.play.x,
	              top: P.players.player.play.y
		  }, 300);
        P.remove_from_player(c.attr("id"));
        P.rearange_player_deck();
    },
    click: function () {
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
    remove_one_from_others: function (other_str) {
	elems = $("." + other_str + "card:last").remove();
    },
    trick_to_player: function (who_string) {
	pos = P.players[who_string].play;
        $ (".playcard").animate({top: pos.y, left: pos.x}, 1000, null,
				function (){P.clear_table();}
			       );
    },
    rearange_player_deck: function () {
	var c;
	P.set_player_deck_x();
	for ( var i = 0; i < P.player_deck.length ; i++){
	    c = $("#" + P.player_deck[i] + ".pcard");
	    c.css('left',P.players.player.deck_pos.x+i*P.player_deck_x_off);
	}
    },
    show_card: function (str,x,y,z,cls) {
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
    move_up: function (str) {
	var selector = "#" + str + ".pcard";
        var c=$(selector);
        if (c.hasClass("selected") == false && c.hasClass("playable") ) {
	    P.deselect_pcard();
	    c.addClass("selected");
	    c.animate({ top: "-="+P.yselection_off },300);
	}
    },
    /* deselect card and move down */
    move_down: function (str) {
	var selector = "#"+str+".pcard";
	var c=$(selector);
	c.removeClass("selected");
	c.animate({top: "+="+P.yselection_off},300);
    },
    /* deselect and move down previosly selected card  */
    deselect_pcard: function (str){
	var selected = $(".selected");
        if (selected) {
	   P.move_down(selected.attr("id"));
	}
    },
    remove_from_player: function (str){
	var idx =  P.player_deck.indexOf(str); // Find the index
	if( idx != -1 ) {
	    P.player_deck.splice(idx, 1); // remove
	}
    },
    /* u zavisnosti od broja karata setuje P.player_deck_pos.x */
    set_player_deck_x: function (){
	var s = P.player_deck.length;
        var deck_w = P.card_size.w + P.player_deck_x_off*(s-1);
        P.players.player.deck_pos.x =  (P.table_size.w - deck_w) / 2;   
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
    show_player_deck: function (){
        P.set_player_deck_x();
	for (var i =0; i< P.player_deck.length; i++){
	    P.show_card( P.player_deck[i],
			 P.players.player.deck_pos.x+i*P.player_deck_x_off,
			 P.players.player.deck_pos.y,
			 i,
		         "pcard");
	}
    },
    get_other: function (other_str){
	if ( other_str == 'left' ) {
	    return P.players.left;
	}
	else {
	    return P.players.right;
	};
    },
    show_other_deck: function (other){
        var player = P.get_other(other);
        for ( var i=0; i < player.card_num; i++){
            var c = P.get_card("backh").clone();
            c.removeClass("hide");
            c.addClass( other + "card");
            c.css('left',player.play.x);
	    c.css('top', player.play.y + player.yoffset*i );
	    c.css('z-index',i);
	    c.appendTo("#sto");
	}
    },
    play_from_others: function (other,str){
	var player = P.get_other(other);	
/*	P.show_card( str,
		     player.ppos.x,
		     player.ppos.y,
		     100,
		     "playcard");	
*/
	P.show_card( str,
		     player.play.x,
		     player.play.y,
		     100,
		     "playcard");	
	$("#"+str + ".playcard")
	    .animate( {  left: player.endpos.x,
	                 top: player.endpos.y
		      },1000);
        P.remove_one_from_others(other);  
    },
    clear_table: function (){
	$(".playcard").fadeOut('slow',
			       function (){
				   $(".playcard").remove();
			       });
	    
    }
}

$(document).ready( function () { 
    P.player_deck = ["c7C","c9C","cAC","cAD","c8H",
		     "c9H","cTH","cTS","cKS","cAS"]
    
    P.init();
    P.show_other_deck('left');
    P.show_other_deck('right');
    P.show_player_deck();
    P.set_playables(["c7C","c9C","cAC"]);
});
