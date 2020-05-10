#!/usr/bin/env python
import pygal
import json
from pygal.style import CleanStyle

# Host
host = "http://localhost/ucl-data-viz/bmi_who"

#
#
#
# PYGAL Create Chart
def generateChart():
    # open WHO raw data
    with open('../data/WHO-BMI-data.json', 'r') as f:
        data_dict = json.load(f)

    fact = data_dict['fact']

    regionSelector = [ "Europe", "Americas" ];
    yearSelector = [ 1975, 2016 ]

    # define new json array
    dataYears = []
    dataFemaleTemporary = []
    dataFemale = []
    dataMaleTemporary = []
    dataMale = []
    gender_dataset = []
    genders = []

    # determine first run
    mainLoopCounter = 0

    # only grab year every third loop (L1: both sex, L2: male, L3: male)
    genderCounter = 1

    # go through nodes and select specifieds region data
    for region in regionSelector:
        for node in fact:
            # only iterate over data in given range
            if int(node['dims']['YEAR']) >= yearSelector[0] and int(node['dims']['YEAR']) <= yearSelector[1]:
                # on fact.node layer
                if node['dims']['REGION'] == region:
                    # copy year once
                    # only create year list on first loop (counter = 0)
                    if mainLoopCounter == 0:
                        if genderCounter == 1:
                            dataYears.append( int(node['dims']['YEAR']) )

                    # copy gender data (get first four character >00.0<)
                    if node['dims']['SEX'] == 'Female':
                        dataFemaleTemporary.append( (float(node['Value'][ 0 : 4 ])-21) )

                    if node['dims']['SEX'] == 'Male':
                        dataMaleTemporary.append( (float(node['Value'][ 0 : 4 ])-21) )

                    # print( node['dims']['YEAR'] + " / " + node['dims']['SEX'] + " / " + node['Value'] )

                    # increase counter
                    genderCounter += 1;

                    # reset counter after 3rd run
                    if genderCounter == 4:
                        genderCounter = 1

        # data setup
        # [ male REGION1, female REGION1,
        #   male REGION2, female REGION2 ]
        # assign temporary gender data to list
        dataFemale.append( dataFemaleTemporary );
        dataMale.append( dataMaleTemporary );

        gender_dataset.append( dataFemaleTemporary )
        gender_dataset.append( dataMaleTemporary )

        genders.append( 'Female ' + region )
        genders.append( 'Male ' + region )

        # reset temporary data arrays
        dataFemaleTemporary = []
        dataMaleTemporary = []

        mainLoopCounter += 1;

    def formatBothWays(x):
        if int(x) < 0:
            val = (int(x)*-1)+21;
        elif int(x) > 0:
            val = int(x)+21;
        elif int(x) == 0:
            val = 21
        else:
            val = 0
        return str( val )

    # setup chart
    pyramid_chart = pygal.Pyramid(
        human_readable=True, 
        legend_at_bottom=True, 
        width=1100,
        height=700,
        style=CleanStyle,
        css = [ 'file://base.css', 'file://style.css', 'file://graph.css', host+'/additional-styles.css'],
        # makes numbers start at 21 (see above, values capped at 21 since the same for ever value --> make differences visible, )
        value_formatter=lambda x: formatBothWays(x)
        )

    # provide diagram title
    pyramid_chart.title = 'Mean Body Mass Index (BMI) Trends, ' + regionSelector[0] + " / " + regionSelector[1] + ' ('+ str(dataYears[-1]) +'-'+ str(dataYears[0]) + ')'
    # pyramid_chart.title = "Male vs. Female"

    # label the diagram
    pyramid_chart.x_labels = map(lambda x: int(x) if not x % 5 else '', range(dataYears[-1],dataYears[0]))

    # add data to chart
    # use class counter to determine when secondary data (region 1 / 2) should be classified
    classCounter = 0

    for gender, gender_data in zip(genders, gender_dataset):
        if classCounter < 2:
            pyramid_chart.add(gender, gender_data)
        elif classCounter < 4:
            pyramid_chart.add(gender, gender_data, secondary=True)
        classCounter += 1

    # Render diagram
    # renderedGraph = pyramid_chart.render()

    # render diagram to file
    pyramid_chart.render_to_file('./rendered-graphs/chart-draft-one.svg')
    pyramid_chart.render_in_browser()

generateChart();