<div id="checkin" data-role="page" data-theme='b'>
    <div data-role="header">
        <h1>Raffle Swag</h1>
    </div>
    <!-- /header -->
    <cfoutput>
    <div data-role="content">
        <form id="checkinForm" method="post" action="#buildURL(action='attendee.save')#" name="checkinForm" data-ajax="false">
            <input type="hidden" name="id" id="id" value="" />
            <div data-role="fieldcontain">
                <label for="Name">
                    Name:
                </label>
                <input type="text" name="Name" id="Name" value="" autocorrect = "off"  data-theme='c' />
            </div>
            <div data-role="fieldcontain">
                <label for="Mobile">
                    Mobile Phone Number:
                </label>
                <input type="tel" name="Mobile"  placeholder="XXX-XXX-XXXX" id="Mobile" value="" required autocorrect = "off"  data-theme='c'/>
            </div><input type="submit" name="checkinBtn" id="checkinBtn" value="Activate">
            <input type="hidden" name="Format" id="Format" value="html"  />
            <input type="hidden" name="AttendeeId" id="AttendeeId" value="0"  />
        </form>
    </div><!-- /content -->
    </cfoutput>

</div><!-- /page -->
