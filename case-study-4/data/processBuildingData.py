import csv
import pandas as pd
from datetime import datetime

with open('LoadsBreakdown_kW_FullDataset.csv', newline='', encoding='utf-8-sig') as f:
    reader = csv.reader(f, delimiter=';')
    # ignore header
    next(reader)

    lastDate = False;
    sumKw = 0

    tempData = []
    totalData = []

    for row in reader:
        # calculate sum per day per dimension
        # convert string to date
        date = datetime.strptime(row[1], '%Y-%m-%dT%H:%M:%S%z')
        day = datetime.date(date)
        
        # convert null to 0
        if row[2] == "null":
                row[2] = 0
        
        if ( day == lastDate ):
            sumKw += float(row[2])
            # sum up all the values as long as the day is the same
            tempData = [ lastDate, row[0], sumKw ]
        else:
            # day yesterday ready to be saved as new day is different
            
            # check whether we are in first loop (=lastDate == False)
            if lastDate is not False:
                # add day, category, and consumption to list
                totalData.append( tempData )
            
                # reset sumKw
                sumKw = 0

            sumKw += float(row[2])

            # increment sumKw by this value
            tempData = [ lastDate, row[0], sumKw ]

        # set this date to lastDate
        lastDate = day

# group entries by date
df = pd.DataFrame(totalData)
df.columns = ['date','area','consumption']
df.sort_values( ['date', 'area'], axis = 0, ascending = True, inplace = True, na_position ='last')

print(df.columns)

df.to_csv('test.csv');

counter = 0
setCounter = 0;
# setup well-formatted CSV file
csvOutput = []
csvHead = ['name', 'Floors Lighting', 'Floors Small Power', 'Kitchen consumption', 'Landlord DB', 'Mechanical and PH Loads', 'Workshop and Reception DBs' ]
csvOutput.append(csvHead);

tempList = []

for index, row in df.iterrows():
    #print (row)
    if counter == 0:
        tempList.append(row['date'])

    if (counter >= 0 and counter <= 5):
        if (counter == 2):
            tempList.append(int(row['consumption'])+1600) # make more salient
        else:
            tempList.append(int(row['consumption']))

    counter += 1;

    if counter == 6:
        ##print(tempList)
        # skip days with null values
        if sum(tempList[1:7]) > 0:
            # filter outlier
            if sum(tempList[1:7]) < 45000:
                # add templist to output
                csvOutput.append(tempList)

        counter = 0
        setCounter += 1
        tempList = []

## determine number of days to output
numberOfDaysToOutput = 14; 
header = csvOutput[0]
dataCount = len(csvOutput);
del csvOutput[1:dataCount-numberOfDaysToOutput];

with open('loadsBreakdown_kw_formatted.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(csvOutput)