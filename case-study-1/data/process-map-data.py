import csv
import json

with open('bookings-by-town.csv', newline='', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    count = 0

    tempData = []
    data = []

    for row in reader:
        # select city name from row 0
        if count == 0:
            # 0 - city: push city to array
            tempData.append(row[0])
            # 1 - total revenue:
            tempData.append(float( row[1] ))
            # 2 - bookings count:
            booking_count = int( row[2] )
            tempData.append( booking_count )

            # 3 - bullet size
            if booking_count <= 10:
                tempData.append(4)
            elif booking_count <= 20:
                tempData.append(6)
            elif booking_count <= 50:
                tempData.append(12)
            elif booking_count <= 100:
                tempData.append(23)
            elif booking_count <= 250:
                tempData.append(40)
            elif booking_count <= 500:
                tempData.append(64)
            elif booking_count <= 1000:
                tempData.append(96)
            elif booking_count <= 2500:
                tempData.append(139)
            elif booking_count <= 5000:
                tempData.append(193)
            elif booking_count <= 10000:
                tempData.append(260)
            elif booking_count > 10000:
                tempData.append(320)

        if count == 1:
            # 4 - lon
            tempData.append(row[0])

        if count == 2:
            # 5 - lat
            tempData.append(row[0])

        # increase counter
        count += 1

        # start over with count
        if count == 3:
            # temporary data added, push to global list
            data.append(tempData)

            # reset variables
            tempData = []
            count = 0

# convert data to json
dataJson = []

for town in data:
    tempJson = {
        "city": town[0],
        "total": town[1],
        "count": town[2],
        "bulletsize": town[3],
        "lon": town[4],
        "lat": town[5],
    }

    dataJson.append(tempJson)

    # reset
    tempJson = [];

with open('final-bookings-by-town.json', 'w') as outfile:
    json.dump(dataJson, outfile)

