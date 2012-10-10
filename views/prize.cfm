<!-- /page -->
<div id="prize" data-role="page" data-theme='b'  data-add-back-btn="false">
	<cfoutput>
	<div data-role="header" >
        <h1>#rc["event"].getName()#</h1>
   </div>
    <!-- /header -->
    <div data-role="content">
        <ul data-role='listview' id="PrizeList">
        <cfloop from="1" to="#ArrayLen(rc["prize"])#" index="i">
        	<li><a href="/index.cfm/prize/find/PrizeId/#rc["prize"][i].getPrizeId()#/Mobile/#rc.Mobile#" id="#rc["prize"][i].getPrizeId()#">#rc["prize"][i].getName()#</a></li>
        </cfloop>
        </ul>
    </div>
	</cfoutput>       
    <!-- /content -->
</div>
<!-- /page -->
