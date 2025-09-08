import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderWidth:3
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
    marginHorizontal: 10,
    //borderWidth: 1,
    //height: 75,
    //justifyContent: 'center',
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
    fontSize: 18,
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
  },
  searchForm: {
    paddingLeft: 5,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10
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
    flexDirection: 'row',
  },
  versionListItemName: {
    //borderWidth: 1, 
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'flex-start',
    flex: 2
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
    justifyContent: "center",
    paddingRight: 10
  },
  header: {
    flexDirection: 'row',
    height: 70,
    //borderWidth: 2,
    //marginTop: 20
  },
  backButton: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  headerMainTitle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 350,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 15,
    padding: 20
  },
  button: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    elevation: 1,
    width: '80%',
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24232B'
  },
  buttonDelete: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    elevation: 1,
    width: '80%',
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5131F',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  error: {
    color: "red",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
  },
  formTextInputModal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButtonModal: {
    backgroundColor: '#319413',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonTextModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#979797ff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000ff',
  },
  offlineText: {
    color: '#ffffffff',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  noSongsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noSongsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
})