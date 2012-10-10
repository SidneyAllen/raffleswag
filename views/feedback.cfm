<div id="find" data-role="page" data-theme='b'  data-add-back-btn="false">
    <div data-role="header">
        <!--<a href="#setting" data-transition="slideup" data-icon="gear" class="ui-btn-right">Settings</a> -->
        <a href="#" data-icon="back" data-rel="back"  data-direction="reverse">Back</a>
        <h1>Feedback</h1>
    </div>
    <!-- /header -->
    <div data-role="content">
    	<cfoutput>
            <form id="findForm" method="post" action="#buildURL(action='raffle.thankyou')#" name="feedbackForm" autocapitalize="off" >
                
                <div data-role="fieldcontain">
                    <label for="Code">
                      Your Name:
                    </label>
                    <input name="Name" id="Name" value="" required autocorrect = "off"  data-theme='c' />
              		<br/>
                    <label for="Code">
                      Your email:
                    </label>
                    <input name="Email" id="Email" value="" required autocorrect = "off"  data-theme='c' />
               		<br/>
                    <label for="Code">
                      Message:
                    </label>
                    <textarea name="Message" id="Message" value="" required   data-theme='c' ></textarea>
                </div>
                
                
                <input type="submit" name="findEvent" id="findEvent" value="Send Feedback">
            </form>
     	</cfoutput>   
       
    </div><!-- /content -->
</div><!-- /page -->
