import csv
import json

with open('adgroups-by-town.csv', newline='', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    count = 0

    dataJson = []
    tempJson = []

    for row in reader:
        # start add data after skipping header row (0)
        if count > 0:
            tempJson = {
                "city": row[0],
                "Impressions": row[1],
                "Impressions_relative": row[2],
                "Spending": row[3],
                "Spending_relative": row[4],
                "Revenue": row[5],
                "Revenue_relative": row[6],
            }
            
            # add data to dataJson
            dataJson.append(tempJson)

            # reset variables
            tempData = []

        # increase counter
        count += 1

with open('final-adgroups-by-town.json', 'w') as outfile:
    json.dump(dataJson, outfile)

