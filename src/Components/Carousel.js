import { size } from 'lodash'
import React from 'react'
import { View, Image } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

export default function CarouselImages({ imagenes, width, height, activeslide, setActiveslide }) {

    const renderItem = ({ item }) => {
        return (
            <Image
                style={{ width, height }}
                source={{ uri: item }}
                resizeMode="stretch"
            />
        )
    }

    return (
        <View>
            <Carousel
                layout={"default"}
                data={imagenes}
                sliderWidth={width}
                itemWidth={width}
                renderItem={renderItem}
                onSnapToItem={(index) => setActiveslide(index)}
            />
            <Paginacion listimagen={imagenes} activeslide={activeslide} />
        </View>
    )
}

function Paginacion({ listimagen, activeslide }) {
    return (
        <Pagination
            dotsLength={size(listimagen)}
            activeDotIndex={activeslide}
            containerStyle={{ backgroundColor: "transparent", zIndex: 1, position: "absolute", bottom: 30, alignSelf: "center" }}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 2,
                backgroundColor: "#25d366",
            }}
            inactiveDotColor={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 2,
                backgroundColor: "#128c7e",
            }}
            inactiveDotOpacity={0.6}
            inactiveDotScale={0.6}
        />
    )
}
