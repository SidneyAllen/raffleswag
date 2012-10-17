// sid maestre
var gPrizeId = "15D541E5-C02E-AAC5-63DEC40247F64CEF";

var app = {};

StackMob.init({
    appName: "raffleswag",
    clientSubdomain: "stackmob339",
    publicKey: "0e0ad3ee-a637-4977-8984-161a9f2fe123",
    apiVersion: 0
});

(function($){    

	var Event = StackMob.Model.extend({
		schemaName: "event"
	});
    
	var Events = StackMob.Collection.extend({
    	model: Event
  	});

  	var Prize = StackMob.Model.extend({
    	schemaName: "prize"
  	});
    
  	var Prizes = StackMob.Collection.extend({
      model: Prize
  	});

  	var Participant = StackMob.Model.extend({
    	schemaName: "participant"
  	});
    
  	var Participants = StackMob.Collection.extend({
      model: Participant
  	});

  	var Drawing = StackMob.Model.extend({
    	schemaName: "drawing"
  	});
    
  	var Drawings = StackMob.Collection.extend({
      model: Drawing
  	});


	var HomeView = Backbone.View.extend({
   
	    initialize: function() {
	      this.template = _.template($('#item-home').html());
	      this.router = this.options.router;
	      this.eventCollection = this.options.eventCollection;
	      this.prizeCollection = this.options.prizeCollection;
	    },

	    events: {
	       "click #findEvent": "find",  
	    },

	    render: function() {
	    	
	    	var el = this.$el;
	      	el.html(this.template());
	      	el.attr("data-theme","b");
	      	el.attr("id","find");
	     	
	      	return this;
	    },

	    find: function(e) {
		    var events = this.eventCollection;
	      		prizes = this.prizeCollection;
		     	router = this.router;

		    e.preventDefault();

		    if(validateEventFind()) 
			{

				var q = new StackMob.Collection.Query();
					q.equals('code', $('#code').val());
					q.setExpand(1);
				
				events.query(q, {
					success: function(model) {

				        prizes.add(model.at(0).get("prizes"))

				        localStorage.setItem('app', JSON.stringify(app));
		    			console.log(app);
				        
				        router.navigate('#prize',{trigger: true, replace: false})

				    },
				    error: function(model, response) {
				        console.debug(response);
				    }
				}); 
		    }

			return this;
	    }
  	});

	var PrizeView = Backbone.View.extend({
   
		initialize: function() {
	    	this.template = _.template($('#item-prize').html());
	    	this.eventCollection = this.options.eventCollection;
	    	this.prizeCollection = this.options.prizeCollection;
	    },

		render: function() {
	    	var prizes 	= this.prizeCollection,
	    		events 	= this.eventCollection,
	   			el 		= this.$el;
	    	
			el.html(this.template(events.at(0).toJSON()));
	     	el.attr("data-theme","b");
	     	el.attr("id","find");

	      	var content = el.find(":jqmData(role='content')");
	      	content.empty();

	      	var listView = new PrizeListView({prizeCollection:prizes});
	      	
	      	content.append(listView.render().el);
	     
	 		return this;
		}
	});


  	var PrizeListView = Backbone.View.extend({
      
      tagName: 'ul',

      initialize: function() {
          this.template = _.template($('#item-prize-list').html());
          this.prizes = this.options.prizeCollection;
      },

      render:function (eventName) {
        var template = this.template,
                  el = this.$el,
          prizes = this.prizes;
        
        el.attr("data-role","listview");
        el.attr("data-theme","c");

        prizes.each(function(model){
			el.append(template(model.toJSON()));
        });
   
        return this;
      }
  	});


	var PrizeDetailView = Backbone.View.extend({
   
	    initialize: function() {
	      this.template = _.template($('#item-prize-detail').html());
	      this.router = this.options.router;
	      this.model = this.options.model;
	      this.drawingCollection = this.options.drawingCollection;
	    },

	    events: {
	       "click #getTicket": "get",  
	    },

	    render: function() {
	      	var	collection = this.collection,
	      		model = this.model,
	      		el = this.$el;
	    	
	      	// Retrieve the object from storage
			
			console.log(app)
			el.html(this.template(model.toJSON()));
	      	el.attr("data-theme","b");
	      	el.attr("id","find");

	      	var ticketContent = el.find("#msgTicket");
	      	ticketContent.empty();

	      	var btnTicket = el.find("#btnTicket");
	      	btnTicket.empty();

	  		if(model.get("selected") === true){

	      		var ticketView = new PrizeTicketView();
				ticketContent.append(ticketView.render().el);

				//var cancelTicketView = new PrizeCancelTicketView();
				//btnTicket.append(cancelTicketView.render().el);
				
			} else {

				var getTicketView = new PrizeGetTicketView();
				btnTicket.append(getTicketView.render().el);
			}
	     
	      	return this;
	    },

	    get: function(e) {
		    var collection = this.collection,
		            router = this.router,
	      			model = this.model,
	      			drawings = this.drawingCollection,
	      			el = this.$el;

		    e.preventDefault();
		    //console.log(model.toJSON())
		    app.prize_id = model.get("prize_id");

		    localStorage.setItem('app', JSON.stringify(app));
		    console.log(app);

		    if (typeof(app.participant_id) === "undefined"){
	    		router.navigate('#checkin',{trigger: true, replace: false})
		
		    } else {

				var q = new StackMob.Collection.Query();
					q.equals('prize', model.get("prize_id"));
				
				drawings.query(q, {
					success: function(coll) {
						var drawing = new Drawing({drawing_id : coll.at(0).get("drawing_id")})

				        drawing.appendAndSave('participants', [app.participant_id] );
						model.set("selected",true);

						var ticketContent = el.find("#msgTicket");
	      				ticketContent.empty();
	      				ticketContent.hide();

						var ticketView = new PrizeTicketView();
						ticketContent.append(ticketView.render().el).slideDown();
						
						var btnTicket = el.find("#btnTicket");
	      				btnTicket.empty();
	      				/*
	      				var cancelTicketView = new PrizeCancelTicketView();
						btnTicket.append(cancelTicketView.render().el);
						*/
   
				    },
				    error: function(model, response) {
				        console.debug(response);
				    }
				}); 

   		    }
			
		    return this;
	    }
  	});

	var PrizeTicketView = Backbone.View.extend({

      initialize: function() {
          this.template = _.template($('#item-prize-ticket').html());
      },

      render:function (eventName) {
        var template = this.template
 
		this.$el.html(template())
        return this;
      }
  	});

  	var PrizeCancelTicketView = Backbone.View.extend({

      initialize: function() {
          this.template = _.template($('#item-prize-ticket-cancel').html());
      },

      render:function (eventName) {
        var template = this.template
 
		this.$el.html(template())
        return this;
      }
  	});

  	var PrizeGetTicketView = Backbone.View.extend({

      initialize: function() {
          this.template = _.template($('#item-prize-ticket-get').html());
      },

      render:function (eventName) {
        var template = this.template
 
		this.$el.html(template())
        return this;
      }
  	});

	var CheckInView = Backbone.View.extend({
   
   		events: {
	       "click #checkinBtn": "activate",  
	    },

		initialize: function() {
	    	this.template = _.template($('#item-checkin').html());
	    	this.eventCollection = this.options.eventCollection;
	    	this.prizeCollection = this.options.prizeCollection;
	    	this.drawingCollection = this.options.drawingCollection;
	    	this.router = this.options.router;
	    },

		render: function() {
	    	var el 	= this.$el;
	    	
			el.html(this.template({"mobile" : app.mobile}));
	     	el.attr("data-theme","b");
	     	el.attr("id","checkin");

	 		return this;
		},

		activate: function(e) {
		    var events = this.eventCollection,
	      		prizes = this.prizeCollection,
	      		drawings = this.drawingCollection,
		     	router = this.router,
		     	 el 	= this.$el;

		    e.preventDefault();

		    var mobileSrc = new String($("#Mobile").val()); 
    			mobileClean = mobileSrc.replace(/[^0-9]/g, '');

		    StackMob.customcode('add_participant', 
			    { 
			    	mobile: mobileClean,
			      	name  : $("#Name").val() 
			    },
			    "POST",
			    
			    {
			        success: function(result) {

			            
			            if(result.verified === "true") {
			            	console.log("verified")
			            	app.mobile = result.mobile;
			            	app.participant_id = result.participant_id;
			            	
			            	localStorage.setItem('app', JSON.stringify(app));
		    				

			            	var returnToPrize = false;
			            	for(i = 0; i < result.drawing.length; i++){
								var prize = prizes.where({prize_id: result.drawing[i].prize});
			            		prize[0].set("selected",true);
			            		if (app.prize_id === result.drawing[i].prize) {
			            			returnToPrize = true;
			            		}
			            	}

			            	if (returnToPrize) {
			            		  router.navigate('#detail/' + app.prize_id,{trigger: true, replace: false});
			            	} else {

				            	var q = new StackMob.Collection.Query();
									q.equals('prize', app.prize_id);
								
								drawings.query(q, {
									success: function(model) {
										var drawing = new Drawing({drawing_id : model.at(0).get("drawing_id")})

								        drawing.appendAndSave('participants', [result.participant_id] );
										
							         	router.navigate('#detail/' + app.prize_id,{trigger: true, replace: false})
				   
								    },
								    error: function(model, response) {
								        console.debug(response);
								    }
								}); 
							}
			            } else {
			            	var messageView = new ActivateMessageView();

			            	var content = el.find(":jqmData(role='content')");
	      					content.empty();

							content.append(messageView.render().el);


			            }
			        },
			        error: function(result) {
			            console.log(result); //prints out the returned JSON your custom code specifies
			            console.log('error')
			           
			        }
			    } 
			  );

			return this;
	    }
	});


	var VerifyView = Backbone.View.extend({
   
		initialize: function() {
	    	this.template = _.template($('#item-verify').html());
	    	this.eventCollection = this.options.eventCollection;
	    	this.prizeCollection = this.options.prizeCollection;
	    	this.code = this.options.code;
	    },

		render: function() {
	    	var prizes 	= this.prizeCollection,
	    		events 	= this.eventCollection,
	   			el 		= this.$el;
	    	
			el.html(this.template());
	     	el.attr("data-theme","b");
	     	el.attr("id","verify");

	     	var appString = localStorage.getItem('app');

	     	if (appString != null) {
		    	app = JSON.parse(appString);
			}


	     	this.verify(this.code);
	 		return this;
		},

		verify: function(e) {
		    var events = this.eventCollection,
	      		prizes = this.prizeCollection,
		     	router = this.router,
		     	el = this.$el;
		    
	
		    StackMob.customcode('verify_participant', 
				{ 
			    	code: e 
			    },
			    "POST",
			    
			    {
			        success: function(result) {
			           console.debug(result); //prints out the returned JSON your custom code specifies
			  		
			           if(result.verified === "true") {
							

			           		app.participant_id = result.participant_id;

							var messageView = new VerifyMessageView();

							var content = el.find(":jqmData(role='content')");
	      					content.empty();

	      					if (typeof(app.prize_id) != "undefined"){

						        app.prizes = new Prizes(app.prizes);
						        app.events = new Events(app.events);
						        app.drawings = new Drawings(app.drawings);

	      						var footerView = new VerifyFooterView();
	      						var footer = el.find(":jqmData(role='footer')");
	      						footer.empty();
	      						footer.append(footerView.render({"prize_id" : app.prize_id}).el).trigger("create");
	      					}

							content.append(messageView.render({"message" : result.detail}).el);

			           } else {


			           }
			        },
			        error: function(result) {
			            console.debug(result); //prints out the returned JSON your custom code specifies
			           
			        }
			    } 
			);
		
			return this;
	    }
	});

	var VerifyMessageView = Backbone.View.extend({

      initialize: function() {
          this.template = _.template($('#item-verify-message').html());
      },

      render:function (e) {
        var template = this.template
 
		this.$el.html(template(e))
        return this;
      }
  	});

  	var VerifyFooterView = Backbone.View.extend({

      initialize: function() {
          this.template = _.template($('#item-verify-footer').html());
      },

      render:function (e) {
        var template = this.template
 
		this.$el.html(template(e))
        return this;
      }
  	});
  
  	var ActivateMessageView = Backbone.View.extend({

      initialize: function() {
          this.template = _.template($('#item-activate-message').html());
      },

      render:function (e) {
        var template = this.template
 
		this.$el.html(template(e))
        return this;
      }
  	});

	AppRouter = Backbone.Router.extend({

	routes:{
	    "":"home",
	    "prize":"prize",
	    "detail/:id":"detail",
	    "checkin":"checkin",
	    "verify/:id":"verify",
	},

	initialize:function () {
	    // Handle back button throughout the application
	    $('.back').live('click', function(event) {
	        window.history.back();

	        return false;
	    });
	    this.firstPage = true;
	},

	home:function () {
	    this.changePage(new HomeView({eventCollection:app.events,prizeCollection:app.prizes,router:this}),true);
	},

	prize:function () {
	    this.changePage(new PrizeView({eventCollection:app.events,prizeCollection:app.prizes, router:this}),false);
	},

	detail:function (e) {
		model = app.prizes.get(e);
	    this.changePage(new PrizeDetailView({collection:app.events,model:model, drawingCollection:app.drawings,router:this}),false);
	},

	checkin:function () {
	    this.changePage(new CheckInView({eventCollection:app.events,prizeCollection:app.prizes,drawingCollection:app.drawings, router:this}),false);
	},

	verify:function (e) {

	    this.changePage(new VerifyView({eventCollection:app.events,prizeCollection:app.prizes, code:e, router:this}),false);
	},

	changePage:function (page,reverse) {
	    $(page.el).attr('data-role', 'page');

	    page.render();
	    
	    $('body').append($(page.el));

	    var transition = $.mobile.defaultPageTransition;

	    if (this.firstPage) {
	        transition = 'none';
	        this.firstPage = false;
	    }
	    
	    $.mobile.changePage($(page.el), {changeHash:false, transition: transition, reverse: reverse});

    }


  });

  app.initData = function(){
    app.events = new Events();
    app.prizes = new Prizes();
    app.drawings = new Drawings();
    app.mobile = "";
    
  }

}(jQuery));

$(document).ready(function () {   
    app.initData()
    raffleswag = new AppRouter();
    Backbone.history.start();           
});


$(document).ready(function(){
	$('#msgEvent').hide();
	
	
  
    required = ["Name", "Mobile"];
    // If using an ID other than #email or #error then replace it here
    //email = $("#email");
    //errornotice = $("#error");
    // The text to show up within a field when it is incorrect
    emptyerror = "Please fill out this field.";
    emailerror = "Please enter a valid e-mail.";
    
    validate = function(){
        //Validate required fields
        for (i = 0; i < required.length; i++) {
            var input = $('#' + required[i]);
            if ((input.val() == "") || (input.val() == emptyerror)) {
                input.addClass("errorField");
                input.val(emptyerror);
                //errornotice.fadeIn(750);
            }
            else {
                input.removeClass("errorField");
            }
        }
        // Validate the e-mail.
        /*
         if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.val())) {
         email.addClass("errorField");
         email.val(emailerror);
         }
         */
        //if any inputs on the page have the class 'needsfilled' the form will not submit
        if ($(":input").hasClass("errorField")) {
            return false;
        }
        else {
            //errornotice.hide();
            return true;
        }
    }
	
	
	
	requiredEventFind = ["code"];
    // If using an ID other than #email or #error then replace it here
    //email = $("#email");
    //errornotice = $("#error");
    // The text to show up within a field when it is incorrect
  
    
    validateEventFind = function(){
        //Validate required fields
        for (i = 0; i < requiredEventFind.length; i++) {
            var input = $('#' + requiredEventFind[i]);
            if ((input.val() == "") || (input.val() == emptyerror)) {
                input.addClass("errorField");
                input.val(emptyerror);
                //errornotice.fadeIn(750);
            }
            else {
                input.removeClass("errorField");
            }
        }
        
        //if any inputs on the page have the class 'needsfilled' the form will not submit
        if ($(":input").hasClass("errorField")) {
            return false;
        }
        else {
            //errornotice.hide();
            return true;
        }
    }
    
    // Clears any fields in the form when the user clicks on them
    $(":input").focus(function(){
        if ($(this).hasClass("errorField")) {
            $(this).val("");
            $(this).removeClass("errorField");
        }
    });
    
    
	
	$('#Code').focus(function(){
		$('#msgEvent').slideUp(500);
	});
	
	$('#setting').click(function(){
		$('#Code').val('');
		$('#msgEvent').hide();
	});
	 
	 
	 
	$('#EventList li').live('vclick', function(){
		$('#Code').val('');
		$('#msgEvent').hide();
	});
	 

    
    $('#EventList a').live('vclick', function(){
        getPrize(this.id);
    });
    
    

});
