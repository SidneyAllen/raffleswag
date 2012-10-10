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

  	var Attendee = StackMob.Model.extend({
    	schemaName: "attendee"
  	});
    
  	var Attendees = StackMob.Collection.extend({
      model: Attendee
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

			var q = new StackMob.Collection.Query();
				q.equals('code', $('#code').val());
				q.setExpand(1);
			
			events.query(q, {
				success: function(model) {
			        
			        prizes.add(model.at(0).get("prizes"))
			        
			        router.navigate('#prize',{trigger: true, replace: false})

			    },
			    error: function(model, response) {
			        console.debug(response);
			    }
			}); 
		      
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
	    },

	    events: {
	       "click #getTicket": "get",  
	    },

	    render: function() {
	      	var	collection = this.collection,
	      		model = this.model,
	      		el = this.$el;
	    
			el.html(this.template(model.toJSON()));
	      	el.attr("data-theme","b");
	      	el.attr("id","find");

	      	var ticketContent = el.find("#msgTicket");
	      	ticketContent.empty();

	      	var btnTicket = el.find("#btnTicket");
	      	btnTicket.empty();

	      	var isDone = false;
	  		if(app.mobile != ""){
	  			console.log('show');
	  			
	      		var ticketView = new PrizeTicketView();
				ticketContent.append(ticketView.render().el);

				var cancelTicketView = new PrizeCancelTicketView();
				btnTicket.append(cancelTicketView.render().el);
				
			} else {
				console.log('hide')

				var getTicketView = new PrizeGetTicketView();
				btnTicket.append(getTicketView.render().el);
			}
	     
	      	return this;
	    },

	    get: function(e) {
		    var collection = this.collection,
		            router = this.router;;

		    e.preventDefault();
		    console.log(app.mobile);
		    router.navigate('#checkin',{trigger: true, replace: false})
			console.log('get')
			/*
			var ev = new Event({name:$('#code').val() });

		    //var events = new Events();
			var q = new StackMob.Collection.Query();
				q.equals('code', $('#code').val());
				q.setExpand(1);
				collection.query(q, {
				    success: function(model) {
				        console.debug(model.toJSON());
				        var ev = app.events.toJSON()[0].prizes;
				        console.log(ev);
				        app.prizes = new Prizes(ev);
				      	console.log(app.prizes);
				        router.navigate('#prize',{trigger: true, replace: false})

				    },
				    error: function(model, response) {
				        console.debug(response);
				    }
				}); 
		      */
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
	    },

		render: function() {
	    	var prizes 	= this.prizeCollection,
	    		events 	= this.eventCollection,
	   			el 		= this.$el;
	    	
			el.html(this.template({"mobile" : app.mobile}));
	     	el.attr("data-theme","b");
	     	el.attr("id","checkin");

	 		return this;
		},

		activate: function(e) {
		    var events = this.eventCollection;
	      		prizes = this.prizeCollection;
		     	router = this.router;

		    e.preventDefault();
		    console.log($("#Mobile").val())
		    StackMob.customcode('add_participant', 
			    { 
			    	mobile: $("#Mobile").val(),
			      	name  : $("#Name").val() 
			    },
			    "POST",
			    
			    {
			        success: function(result) {
			            console.debug(result); //prints out the returned JSON your custom code specifies
			            
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
	    	
			console.log(this.code);
			el.html(this.template());
	     	el.attr("data-theme","b");
	     	el.attr("id","verify");
	     	this.verify(this.code);
	 		return this;
		},

		verify: function(e) {
		    var events = this.eventCollection,
	      		prizes = this.prizeCollection,
		     	router = this.router,
		     	el = this.$el;
		    console.log('verify called' + e)
		    console.log(el);

		    StackMob.customcode('verify_participant', 
				{ 
			    	code: e 
			    },
			    "POST",
			    
			    {
			        success: function(result) {
			           console.debug(result); //prints out the returned JSON your custom code specifies
			           console.log(el);
			           if(result.verified) {
							var messageView = new VerifyMessageView();

							var content = el.find(":jqmData(role='content')");
	      					content.empty();

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
    this.changePage(new PrizeDetailView({collection:app.events,model:model, router:this}),false);
},

checkin:function () {
    this.changePage(new CheckInView({eventCollection:app.events,prizeCollection:app.prizes, router:this}),false);
},

verify:function (e) {
    this.changePage(new VerifyView({eventCollection:app.events,prizeCollection:app.prizes, code:e, router:this}),false);
},

changePage:function (page,reverse) {
    $(page.el).attr('data-role', 'page');

    page.render();
    
    $('body').append($(page.el));

    var transition = $.mobile.defaultPageTransition;
    // We don't want to slide the first page
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
    app.mobile = "";
    //app.events.fetch({async: false});  
  }

}(jQuery));

$(document).ready(function () {
    
    app.initData()
    raffleswag = new AppRouter();
    Backbone.history.start();           
});









$(document).ready(function(){
	$('#msgEvent').hide();
	
	
	/*
    if (window.openDatabase) {
        persistence.store.websql.config(persistence, "raffle-a3", 'raffle db', 2 * 1024 * 1024);
    }
    else {
        persistence.store.memory.config(persistence);
		
    }
    
    var Attendee = persistence.define('Attendee', {
        Name: "TEXT",
        Mobile: "TEXT"
    });
    
    var Prize = persistence.define('Prize', {
        Name: "TEXT",
        Description: "TEXT",
        Link: "TEXT",
        EventId: "TEXT",
		Done: "BOOL"
		
    });
    
	 var Event = persistence.define('Event', {
        Name: "TEXT",
    });
	
	var Attendees = Attendee.hasMany('Prizes', Prize, 'Attendees');
	var Prizes = Prize.hasMany('Attendees', Attendee, 'Prizes');

    persistence.schemaSync();
    
    window.Attendee = Attendee;
    window.Prize = Prize;
    window.Event = Event;

	window.Attendees = Attendees;
    window.Prizes = Prizes;
    */
  
    // check if user has checked in yet
    /*
    Attendee.all().list(null, function(result){
        result.forEach(function(p){
			var mobile = p.Mobile.replace(/[']/g,'');
            $('#Name').val(p.Name);
            $('#Mobile').val(mobile);
            $('#id').val(p.id);
			$('#settingName').html(p.Name);
            $('#settingMobile').html(mobile);
			
			getEvent();
			
			$.mobile.changePage(
				$("#find"), {
				transition: "pop",
				reverse: false,
				changeHash: true
			});
        });
        
    });
	*/
    
  
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
	
	
	
	requiredEventFind = ["Code"];
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
    
    
	
/* ------CHECK IN -----------*/   
/*
    $('#checkinBtn').live("vclick", function(){

        if (validate()) {
			$.mobile.showPageLoadingMsg();
            $.ajax({
			
                url: '/index.cfm?action=attendee.save',
                data: 'Name=' + $('#Name').val() + '&Mobile=' + $('#Mobile').val() + '&AttendeeId=0&Format=JSON',
                success: function(data){
					var obj = $.parseJSON(data);
						
					if (obj != null) {

						var arrAttendee = obj['attendee'];
						var a = new Attendee({
		                    Name: arrAttendee.Name,
		                    Mobile: "'" + arrAttendee.Mobile + "'"  ,
							id: arrAttendee.AttendeeId
		                });
		                persistence.add(a);
						persistence.flush();
						
						
						var arrPrize = obj['attendee']['Prizes'];
						if (arrPrize != null) {
							for (var i = 0; i < arrPrize.length; i++) {
								var p = new Prize({
									id: arrPrize[i].PrizeId,
									Name: arrPrize[i].Name,
									Description: arrPrize[i].Description,
									Link: arrPrize[i].Link,
									EventId: arrPrize[i].EventId,
									Done: true
								});
								persistence.add(p);
								persistence.flush();
								//a.Prizes.add(p);
								persistence.flush();
							}
						}
						
					 }
					 $('#settingName').html( $('#Name').val());
            		$('#settingMobile').html( $('#Mobile').val());
				},
                error: function(data){
                    alert('problem deleting try again.');
                }
            });
            
			getEvent();
		
            $.mobile.changePage(
				$("#detail"), {
				transition: "pop",
				reverse: false,
				changeHash: true
			});
		
			$.mobile.hidePageLoadingMsg();
        }
        
    });
*/
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
	 


/* ------FIND EVENT -----------*/
/*
    $('#findEvent').click(function(){

		
		if(validateEventFind()) 
		{
			$.mobile.showPageLoadingMsg();
			 $.ajax({
				url: '/index.cfm?action=event.find',
				data: 'Code=' + $('#Code').val() + '&Mobile=' + $('#Mobile').val() + '&Format=JSON',
				success: function(data){
					var obj = $.parseJSON(data);
					var currId = '0';
					var currName = 'none';
					//console.log(obj);
					
					if (obj != null) {
					
						var arrEvent = obj['event'];
						
						if (arrEvent != '') {
						
							if (arrEvent != null) {
								currId = arrEvent.EventId;
								currName = arrEvent.Name;
								
								var e = new Event({
									id: arrEvent.EventId,
									Name: arrEvent.Name
								});
								persistence.add(e);
								persistence.flush();
							}
							
							var arrPrize = obj['prize'];
							if (arrPrize != null) {
								for (var i = 0; i < arrPrize.length; i++) {
									var p = new Prize({
										id: arrPrize[i].PrizeId,
										Name: arrPrize[i].Name,
										Description: arrPrize[i].Description,
										Link: arrPrize[i].Link,
										EventId: arrPrize[i].EventId
									});
									persistence.add(p);
									persistence.flush();
								}
							}
							
							getEvent();
							getPrize(currId);
							$('#prize h1').html(currName);
							$('#Code').val('');
							$.mobile.changePage(
								$("#prize"), {
								transition: "slideup",
								reverse: false,
								changeHash: true
							});
							return false;
						} else {
							//console.log('no event found');
							$('#msgEvent').html('No Raffle Match');
							$('#msgEvent').slideDown();
							
						}
					}
					$.mobile.hidePageLoadingMsg();
				},
				error: function(data){
					$.mobile.hidePageLoadingMsg();
					alert('problem finding try again.');
				}
			});
		}
    });
*/
    
    $('#EventList a').live('vclick', function(){
        getPrize(this.id);
    });
    
    
	
	/* ------EVENT -----------*/
    function getEvent(){
		//check if any events in local db
		Event.all().count(null, function(c){
			if (c > 0) {
				$('#EventList').empty();
            	$('#EventList').append('<li data-role="list-divider">Raffles Found</li>');
				// load event from local db
				Event.all().order("Name", false).list(null, function(results){
					results.forEach(function(e){
						$('#EventList').append('<li><a href="#prize"  name="' + e.Name + '" id="' + e.id + '">' + e.Name + '</a></li>').listview('refresh');                               
					});
				});
			}
		});
		
        
    }
	
	$('#EventList a').live('vclick', function(){
		console.log(this.name);
		console.log(this.id);
		$('#prize h1').html(this.name);
        getPrize(this.id);
    });
    
    
	
		/* ------PRIZE -----------*/
    function getPrize(EventId){
        Prize.all().filter("EventId", '=', EventId).order("Name", false).list(null, function(results){
        
            $('#PrizeList').empty();
            $('#PrizeList').append('<li data-role="list-divider">Raffle Prizes</li>');
            
            
            results.forEach(function(p){
                $('#PrizeList').append('<li><a href="#detail" id="' + p.id + '">' + p.Name + '</a></li>').listview('refresh');
               // $('#PrizeList').append('<li><a href="#detail" id="' + p.id + '">' + p.Name + '</a></li>');
                
            });
        });
    }
    
    $('#PrizeList a').live('vclick', function(){
		gPrizeId = this.id;
        getPrizeDetail(this.id);
    });
    
    
    function getPrizeDetail(PrizeId){
		//console.log(PrizeId);
        /* TEST IF TICKET ALREADY FOR THIS USER */
		Prize.all().filter("id", '=', gPrizeId).order("Name", false).list(null, function(results){
        
            results.forEach(function(p){
				if(p.Done){
					$('#msgTicket').show();
					$('#cancelTicket').show();
					$('#getTicket').hide();
				} else {
					$('#msgTicket').hide();
					$('#cancelTicket').hide();
					$('#getTicket').show();
       			}
				//console.log(p.Done);
                $('#detail h1').html(p.Name);
                $('#detail p').html(p.Description);
				$('#detail h3').html(p.Name);
                $('#PrizeId').val(p.id);
            });
        });
    }

/* ------ TICKET ------------- */
/*
    $('#getTicket').live('vclick',function(){
		
		
		  // check if user has checked in yet
			Attendee.all().list(null, function(result){
				if(result.length == 0) {
						console.log('no mobile');
						$.mobile.changePage(
							$("#checkin"), {
							transition: "pop",
							reverse: false,
							changeHash: true
						});
				} else {
				result.forEach(function(p){
					var mobile = p.Mobile.replace(/[']/g,'');
					$('#Name').val(p.Name);
					$('#Mobile').val(mobile);
					$('#id').val(p.id);
					$('#settingName').html(p.Name);
					$('#settingMobile').html(mobile);
					
					//getEvent();
					
					
					
					
				});
				
				setTicketStatus("get");
				}
				
			});
		
		
    	//setTicketStatus("get");
	});
*/
	
    $('#cancelTicket').live('vclick',function(){
    	setTicketStatus("cancel");
	});

	
	function setTicketStatus(status){
    	
		$.mobile.showPageLoadingMsg();
		
		var isDone = true
		if(status == 'cancel') {
			isDone = false;
		}
		
		Prize.all().filter("id", '=', $('#PrizeId').val()).order("Name", false).list(null, function(results){
            results.forEach(function(p){
				p.Done = isDone;
                persistence.add(p);
				persistence.flush();
				//console.log('updated')
            });
        });
		
		Attendee.all().list(null, function(result){
        result.forEach(function(p){
			var mobile = p.Mobile.replace(/[']/g,'');
            
		
		
				$.ajax({
					url: '/index.cfm?action=attendee.ticket',
					data: 'isDone=' + isDone + '&PrizeId=' + $('#PrizeId').val() + '&Mobile=' + mobile + '&Format=JSON',
					success: function(data){
						var obj = $.parseJSON(data);
						//console.log(obj) 		
						
						
						$.mobile.hidePageLoadingMsg();
						if (obj != null) {
							
							if(obj.isDone) {
							   
								 $('#getTicket').fadeOut(500,function() {
									$('#cancelTicket').fadeIn(500,function(){ $('#msgTicket').slideDown(500);});
							   
								});									
							} else {
								$('#msgTicket').slideUp(500,function(){
									$('#cancelTicket').fadeOut(500, function() {
										$('#getTicket').fadeIn(500);	
									});
								});
								
								
							}
						}
					},
					error: function(data){
						$.mobile.hidePageLoadingMsg();
						alert('problem finding try again.');
					}
				});
		
            });
        });

		
		
		return false;
	  }
		
		
	/* ----- CHECKOUT --------*/           
    $('#checkoutButton').live("vclick",function(){
    
		//console.log('deactivate');
		$.mobile.showPageLoadingMsg();
		
		 $.ajax({
			
                url: '/index.cfm?action=attendee.unverify',
                data: 'Name=' + $('#Name').val() + '&Mobile=' + $('#Mobile').val() + '&Format=JSON',
                success: function(data){
					var obj = $.parseJSON(data);
					//console.log(obj) 	
						
					$('#Name').val('');
					$('#Mobile').val('');
					$('#id').val('');
					
					Attendee.all().list(null, function(result){
					
						result.forEach(function(a){
							persistence.remove(a);
							persistence.flush();
						});
						
					});
					
					Prize.all().list(null, function(result){
						result.forEach(function(p){
							persistence.remove(p);
							persistence.flush();
						});
					});
					
					Event.all().list(null, function(result){
						result.forEach(function(p){
							persistence.remove(p);
							persistence.flush();
						});
					});
					
					$('#EventList').empty();
					$('#PrizeList').empty();
					
					$.mobile.hidePageLoadingMsg();
					
				},
                error: function(data){
					$.mobile.hidePageLoadingMsg();
                    alert('problem deleting try again.');
                }
            });
        
		
		$.mobile.changePage(
			$("#find"), {
			transition: "fade",
			reverse: true,
			changeHash: true
		});
    });
    

});
