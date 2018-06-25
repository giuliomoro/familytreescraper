#!/bin/bash

#SURNAME
[ -z "$OFFSET" ] && OFFSET=0
[ -z "$COUNT" ] && COUNT=500
[ -z "$STARTYEAR" ] && STARTYEAR=1980
[ -z "$ENDYEAR" ] && ENDYEAR=1990

#curl "https://www.familysearch.org/service/search/hr/personas?count=$COUNT&query=%2Bsurname%3A$SURNAME%20%2Bany_year%3A$STARTYEAR-$ENDYEAR~&collection_id=$COLLECTION_ID&offset=%OFFSET" add the rest here (and/or amend the url) by "copy as curl" from Chrome's inspector

