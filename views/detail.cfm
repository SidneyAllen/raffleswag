<div id="detail" data-role="page" data-theme='b'  data-add-back-btn="false">
    <cfoutput>
    <div data-role="header" >
        <h1>#rc.prize.getName()#</h1>
    </div>
    <!-- /header -->
    <div data-role="content">

        <div data-inline="true">
            <a href="/index.cfm/attendee/ticket/Format/html/PrizeId/#rc["prize"].getPrizeId()#/Mobile/#rc.Mobile#/isDone/true" id="#rc["prize"].getPrizeId()#" data-role="button" id="getTicket">Get Ticket</a>
        </div>

		<h3 id="PrizeName">
           #rc.prize.getName()#
        </h3>
        <p id="PrizeDescription">
            #rc.prize.getDescription()#
        </p>
    
    </div><!-- /content -->
    </cfoutput>
</div><!-- /page -->
