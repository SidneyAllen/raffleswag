<div id="find" data-role="page" data-theme='b'>
    <div data-role="header" data-backbtn="false">
         <h1>Raffle Swag</h1>
    </div>
    <!-- /header -->
    <div data-role="content">
        <label for="Code">
            Enter Raffle code: (for fun try "demo")
        </label>
        <input name="Code" id="Code" value="" required  autocapitalize="off" />
        <input type="button" name="findEvent" id="findEvent" value="Find Raffle">

        <div id="msgEvent"></div>
        <div>&nbsp;</div>
        <ul data-role='listview' data-theme="c" id="EventList"></ul>
                    
    </div><!-- /content -->
</div><!-- /page -->

<!-- /page -->
<div id="prize" data-role="page" data-theme='b'>
    <div data-role="header">
     	<a href="#find" data-role="button" data-direction="reverse" data-icon="back" data-iconpos="notext">Home</a>
        <h1>Event Title</h1>
        <a href="#setting" data-transition="slideup" data-icon="gear"  data-iconpos="notext">Settings</a>
    </div>
    <!-- /header -->
    <div data-role="content">
        <ul data-role='listview' data-theme="c" id="PrizeList">
        </ul>
    </div>
    <!-- /content -->
</div>
<!-- /page -->

<div id="detail" data-role="page" data-theme='b'>
    <div data-role="header">
   	 <a href="#prize" data-role="button" data-direction="reverse" data-icon="back" data-iconpos="notext">Home</a>
        <h1>Prize Title</h1>
       
    </div>
    <!-- /header -->
    <div data-role="content">
        <div data-inline="true">
            <a href="#" data-role="button" id="cancelTicket">Cancel Ticket</a>
        </div>

        <div data-inline="true">
            <a href="#" data-role="button" id="getTicket">Enter Ticket</a>
        </div>
        <div id="msgTicket">
        <img src="data:image/png;base64,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%3D%3D" />
        
        </div>
        <input type="hidden" name="PrizeId" id="PrizeId" value="0">
		
        <h3 id="PrizeName">
            Prize Name
        </h3>
         <p id="PrizeDescription">
            This is the descripton of the Prize.
        </p>
    </div><!-- /content -->
</div><!-- /page -->

<div id="setting" data-role="page"    data-theme='b'>
    <div data-role="header">
    	<a href="#prize" data-role="button" data-direction="reverse" data-icon="back" data-iconpos="notext">Back</a>
        <h1>Settings</h1>
    </div>
    <!-- /header -->
    <div data-role="content">
        
        <div data-role="fieldcontain">
            <label for="settingName">
               Name:
            </label>
            <div id="settingName" data-inline="true" class="display"></div>
        </div>
        <div data-role="fieldcontain">
            <label for="settingMobile">
               Mobile: <div id="settingMobile" data-inline="true" class="display"></div>
            </label>
            
        </div>

        <div data-inline="true">
             <a href="#" data-theme='c' data-role="button"  data-transition="fade" id="checkoutButton">Deactivate</a>
        </div>
        
        Deactivating your account will remove you from all raffles.

    </div><!-- /content -->
</div><!-- /page -->


<div id="checkin" data-role="page" data-theme='b'>
    <div data-role="header"  data-back-btn="false">
    	<a href="#find" data-role="button" data-icon="home" data-transition="fade" data-iconpos="notext">Home</a>
        <h1>Create Account</h1>
    </div>
    <!-- /header -->
    <div data-role="content">
		<div style="font-size:14px;font-weight:bold;  text-align:center;">You will receive a text message, please click the link to verify your account.</div>
        <form id="checkinForm" name="checkinForm" autocapitalize="off">
            <input type="hidden" name="id" id="id" value="" />
                <label for="Name">
                    Name:
                </label>
                <input type="text" name="Name" id="Name" value="" />
           
                <label for="Mobile">
                    Mobile Phone Number:
                </label>
                <input type="tel" name="Mobile" placeholder="XXX-XXX-XXXX" id="Mobile" value="" required />
              
             
            <input type="button" name="checkinBtn" id="checkinBtn" value="Activate">
        </form>
        
    </div><!-- /content -->
</div><!-- /page -->