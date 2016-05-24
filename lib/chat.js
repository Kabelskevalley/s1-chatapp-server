var auth = require('./auth')

module.exports = function(io) {

    var numUsers = 0;

    io.on('connection', function(socket){
        var addedUser = false; 

        // when the client emits 'add user', this listens and executes
        socket.on('add user', function (token) {
            if (addedUser) return;

            auth.authorize(token, function(success, user) {
                if (success) {
                   // we store the user in the socket session for this client
                    socket.user = user;

                    ++numUsers;
                    addedUser = true;
                }
            });
        });

        socket.on('join', function (channel) {
            socket.channel = channel;
            socket.join(channel);

            // notify users in the channel that user has joined
            io.to(socket.channel).emit('user joined', {
                user: socket.user,
                numUsers: numUsers
            });
        });

        socket.on('leave', function (channel) {
            socket.leave(channel);
        });

        // when the client emits 'new message', this listens and executes
        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            io.to(socket.channel).emit('new message', {
                user: socket.user,
                message: data
            });
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', function () {
            io.to(socket.channel).emit('typing', {
                user: socket.user
            });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', function () {
            io.to(socket.channel).emit('stop typing', {
                user: socket.user
            });
        });

        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            if (addedUser) {
                --numUsers;

                // echo that this client has left
                io.to(socket.channel).emit('user left', {
                    user: socket.user,
                    numUsers: numUsers
                });
            }
        });
    });
}