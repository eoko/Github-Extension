


Pattern
=======

Request - Reply
---------------

    +------------+                    +-------------+
    |            |------------------->|             |
    |   Client   |  Request / Reply   |   Service   |
    |            |<-------------------|             |
    +------------+                    +-------------+


One - Way
---------

    +------------+                    +-------------+
    |            |      Request       |             |
    |   Client   |------------------->|   Service   |
    |            |                    |             |
    +------------+                    +-------------+


Request - Reply - Callback
------------------

    +------------+                    +-------------+
    |            |------------------->|             |
    |   Client   |   Request / Reply  |   Service   |
    |            |<-------------------|             |
    +------------+                    +-------------+
           ^                                 |
           |            Callback             |
           +---------------------------------+


Message
=======

### Request

    {
        type : request
        topic : background
        name : account.connexion
        correlation : correlationId
        // and any extra params
    }

### Reply

    {
        // plain object
    }

### Callback

    {
        type : callback
        correlation : correlationId
        // and any extra params
    }


Command Message

{
    pattern : one-way
    event : account.connexion

}

{
    name : user.synchronisation
    type : command
    params : {}
    ackEvent :  account.user.synchronisation
}

{
    event : accountConnexion
    params : {}
}

Ack Message

{
    type : ack
    name :
}

accountUserSynchronisation

accountRepositorySynchronisation


Status Message

{
    name : global
    type : status
    status : success
    message : Your account is successfully connected
}
{
    name : global
    type : status
    status : failed
    message : We cannot connect your account
}