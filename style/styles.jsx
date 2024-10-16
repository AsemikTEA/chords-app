import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    signContainer: {
        margin: 20
    },
    formContainer: {
        marginTop: 30,
        marginBottom: 30,
        gap: 15
    },
    formTextStyle: {
        fontWeight: 'bold',
        fontSize: 20
    },  
    formTextInput: {
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        fontSize: 20,
        paddingLeft: 8
    },
    welcomeText: {
        fontWeight: 'bold', 
        fontSize: 40,
        alignSelf: 'flex-start'
    },
    buttonTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
    },
    submitButton: {
        backgroundColor: '#24232B',
        borderRadius: 5,
        height: 45,
        width: '100%',
        justifyContent: 'center'
    },
    listItem: {
        marginLeft: 10,
        marginRight: 10,
        //borderWidth: 1,
        height: 75,
        justifyContent: 'center',
        paddingLeft: 20,
        gap: 8
    },
    listItemSongName: {
        fontSize: 25,
        fontWeight: 'bold',
        justifyContent: 'center',
        //borderWidth: 1
    },
    listItemAuthor: {
        fontSize: 18
    },
    searchForm: {
        paddingLeft: 5, 
        height: 50, 
        justifyContent: 'center', 
        marginBottom: 15
    },
    separator: {
        width: 350, 
        alignSelf: 'center', 
        margin: 5, 
        backgroundColor: 'black', 
        height: 2
    },
    versionListItem: {
        marginLeft: 10,
        marginRight: 10,
        //borderWidth: 1,
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row'
    },
    versionListItemName: {
        //borderWidth: 1, 
        flexDirection: 'row', 
        alignItems: "center", 
        justifyContent: 'flex-start', 
        flex: 1 
    },
    versionListItemNameText: {
        //borderWidth: 1, 
        fontSize: 25, 
        fontWeight: 'bold'
    },
    versionListItemRating: { 
        //borderWidth: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        flex: 1, 
        gap: 10
    },
    versionListItemText: {
        //borderWidth: 1, 
        justifyContent: "center"
    },
    header: { 
        flexDirection: 'row', 
        height: 60, 
        marginTop: 5,
        position: 'absolute' 
    },
    backButton: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    headerTitleContainer: { flex: 8, justifyContent: 'center', alignItems: 'center' },
    headerMainTitle: { fontWeight: 'bold', fontSize: 20 }
})