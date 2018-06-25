var fs = require('fs');
var cp = require('child_process');
var qs = require('querystring');

function makeFilename(surname, startYear, endYear, count)
{
	return "cache/out-surname="+surname+":startYear="+startYear+":endYear="+endYear+":count="+count+".json";
}
var surnamesFiles = "surnames.txt";
var startYear = 1980;
var endYear = 1990;
var count = 50;
var useCache = 1;

var surnamesFile = fs.readFileSync(surnamesFiles, {
		encoding: "UTF-8",
	});
// tokenize lines
surnames = surnamesFile.split(/\n/);
// remove empty entries
var s = 0;
while(s < surnames.length)
{
	if(surnames[s] == '')
		surnames.splice(s, 1);
	else
		++s;
}
for(var s in surnames)
{
	var surname = surnames[s];
	var fileExists = false;
	var file = makeFilename(surname, startYear, endYear, count);
	try {
		fs.accessSync(file, 'a');
		fileExists = true;
	} catch (err) {};
	var jsonResponse;
	if(!(useCache && fileExists))
	{
		// do curl request and validate result
		var ret = cp.spawnSync('./cu.sh', {
			env: {
				SURNAME: qs.escape(surname),
				STARTYEAR: startYear,
				ENDYEAR: endYear,
				COUNT: count,
			}
		});
		if(ret.status != 0)
		{
			console.log("ERROR: cu.sh for '"+surname+"' returned " + ret.status);
			continue;
		}
		jsonResponse = ret.stdout;
		// cache file for later
		// for whatever reason, doing this asynchronously does not work
		var err = fs.writeFileSync(file, ret.stdout);
		if(err)
			console.log("Failed to write file");
	} else {
		// read from cached file
		jsonResponse= fs.readFileSync(file, {
			encoding: "UTF-8",
		});
	}

	doc = JSON.parse(jsonResponse);
	var eventInRangeCount = 0;
	var hits = doc.searchHits;
	for(var n in hits)
	{
		var person = hits[n].personHit.person;
		var foundEventInRange = false;
		for(var e in person.event)
		{
			var date = person.event[e].date;
			var re = /[0-9]{4,4}/;
			if(date)
			{
				mat = date.match(re);
				if(mat)
				{
					var year = mat[0];
					if(year >= startYear && year <= endYear)
					{
						foundEventInRange = true;
						//console.log("person: ", n);
						//console.log(date);
						break;
					}
				}
			}
		}
		eventInRangeCount += foundEventInRange;
	}
	console.log(surname + ": " + eventInRangeCount);
}
