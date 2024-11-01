import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useTranspositionNumberStore } from '../state/store';

const Transpose = () => {

    const transpositionNumber = useTranspositionNumberStore((state) => state.transpositionNumber);
    const transposeUp = useTranspositionNumberStore((state) => state.transposeUp);
    const transposeDown = useTranspositionNumberStore((state) => state.transposeDown);

    return (
        <View style={{ borderWidth: 1, height: 50 }}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable
                    style={{ borderWidth: 1, flex: 1, }}
                    onPress={transposeUp}
                >
                    <Text>Nahoru</Text>
                </Pressable>
                <View>
                    <Text>{transpositionNumber}</Text>
                </View>
                <Pressable
                    style={{ borderWidth: 1, flex: 1, }}
                    onPress={transposeDown}
                >
                    <Text>Dolu</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Transpose