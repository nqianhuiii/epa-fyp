import React from 'react'
import { Image, Pressable } from 'react-native'
import { dashboardIcon } from '../../constants/homeDashboardIcon'
import { Box } from '../ui/box'
import { Text } from '../ui/text'

export default function DashboardIcon(){
  return (
    <Box className="flex flex-row flex-wrap w-full justify-center items-center mt-4" >
        {dashboardIcon.map((item) => (
            <Box key={item.id} className="w-1/3 p-2">
                <Pressable 
                    onPress={item.onPress}
                    className="items-center justify-center">
                    <Image
                        source={item.image}
                        style= {{ height: 40, width: 40}}
                    />
                </Pressable>
                <Text className="text-center mt-1 text-sm font-medium">{item.label}</Text>
            </Box>
        ))}
    </Box>
  )
}

