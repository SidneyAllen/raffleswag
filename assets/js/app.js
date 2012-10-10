// sid maestre

var gPrizeId = "15D541E5-C02E-AAC5-63DEC40247F64CEF";

$(document).bind("mobileinit", function() {
      $.mobile.page.prototype.options.addBackBtn = false;
	  $.mobile.page.prototype.options.useFastClick = true;
 });

        $(document).ready(function(){
        	$('#msgEvent').hide();
			
			
					
			
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
            
          
            // check if user has checked in yet
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
