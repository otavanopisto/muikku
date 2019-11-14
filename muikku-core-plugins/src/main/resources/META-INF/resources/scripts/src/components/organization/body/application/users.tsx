import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';

interface UsersProps {
}

interface UsersState {
}



class Users extends React.Component<UsersProps, UsersState> {

  
  render(){
    return (
        <div>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at lorem laoreet, vestibulum mi nec, viverra tortor. Donec id dolor mi. Aenean vehicula lorem odio, a mollis lorem rhoncus sit amet. Etiam nec erat rhoncus, sollicitudin velit in, aliquet dui. Morbi in tristique arcu. Aliquam vulputate facilisis dolor, ut mattis elit vestibulum ut. Aliquam malesuada blandit lacus, sit amet lobortis elit commodo sit amet.

        Sed nec erat porttitor, eleifend nibh id, euismod nisl. Curabitur faucibus ante vitae eros blandit lacinia. Sed tempus posuere nisl, ut fermentum erat consectetur nec. Aenean facilisis neque et justo auctor, eu fringilla nulla pulvinar. Sed quis porta lorem. Fusce lacinia ante et quam luctus, at tempus ligula commodo. Nullam porttitor tortor augue, et dapibus felis imperdiet non.

        Nam commodo justo metus, vitae tempus justo dapibus at. Aliquam vestibulum lacinia metus, quis gravida nisl egestas in. Maecenas et porttitor nisl. Praesent vel consectetur odio. Aenean ac nisl sem. Suspendisse quis risus vitae leo placerat vehicula ut et nibh. Pellentesque eu tellus malesuada, hendrerit velit sit amet, ultricies diam. Sed in sapien at nibh laoreet molestie. Sed feugiat leo quis pharetra maximus. Maecenas est nunc, pharetra eu massa nec, tincidunt pharetra eros. Nunc laoreet euismod justo, eu convallis orci vehicula at. Maecenas tincidunt ut sem eget iaculis. Suspendisse vel sem feugiat, fringilla ex quis, feugiat libero. Duis rutrum dolor at tortor malesuada, quis interdum mi mattis. Proin in scelerisque mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;

        Sed non ultrices leo, sed porttitor tellus. Suspendisse maximus nunc vitae dapibus lobortis. Nullam vel consectetur lacus, sed sodales ipsum. Donec mollis aliquet cursus. Phasellus scelerisque porta vehicula. Nunc tincidunt porttitor commodo. Sed blandit placerat sollicitudin. Nunc nec luctus lorem, cursus pharetra mauris. Phasellus nec mollis dolor. Praesent in mi quis nulla cursus finibus id eu ex. Vestibulum vulputate nisi non sapien finibus malesuada.

        Phasellus a est congue augue vehicula aliquet nec in diam. Aliquam finibus, massa eget venenatis commodo, dui quam ultrices leo, ut tristique felis dui et ipsum. Cras a arcu varius, consectetur turpis sit amet, auctor enim. Aliquam rhoncus, tellus ut porttitor congue, neque arcu dapibus felis, quis porta ante quam hendrerit orci. Ut facilisis risus sed varius faucibus. Praesent imperdiet odio nec nisi commodo varius. Nulla dui massa, ornare congue lobortis nec, finibus at dui. In hac habitasse platea dictumst. Morbi imperdiet diam ac erat mattis, at posuere sapien semper. Donec lacinia augue id efficitur scelerisque. Duis eget faucibus tortor, quis blandit erat. Phasellus non sem ipsum. Sed mollis, sapien vitae malesuada porta, augue ante consequat orci, a lobortis lorem felis non felis. </div>
    );
  }
}

function mapStateToProps(state: StateType){
  return {
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
