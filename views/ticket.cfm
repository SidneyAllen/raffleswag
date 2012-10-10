
<div id="detail" data-role="page" data-theme='b'  data-add-back-btn="false">
    <cfoutput>
    <div data-role="header" >
        <h1>Success</h1>
    </div>
    <!-- /header -->
    <div data-role="content">
   		<a href="/index.cfm/event/find/EventId/#rc.data.prize.getEventId()#/Mobile/#rc.Mobile#/Format/html/" id="#rc.data.prize.getPrizeId()#" data-role="button">Return to Prize List</a></li>

    	<h3 id="PrizeName">
            You are entered to win a #rc.data.prize.getName()#
        </h3>
		<div data-inline="true">
        	<div id="msgTicket"><div id="tixNumber">&nbsp;</div></div>
        </div>
        
	        
    </div><!-- /content -->
    </cfoutput>
</div><!-- /page -->

