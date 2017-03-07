function newRunner(event)
    {
        event.preventDefault();
        var xml = new XMLHttpRequest();
        xml.open('POST', 'http://localhost:8081/addRunner');
        xml.onreadystatechange = function(){
            if (xml.status == 200)
                {
                    if (xml.readyState == 0)
                        {
                            var balk = document.createElement('progress');
                            balk.setAttribute('min', 0);
                            balk.setAttribute('max', 0);
                            balk.setAttribute('id', 'pro');
                            balk.setAttribute('class', 'progress-bar');
                            document.getElementById('balk').appendChild(balk);
                        }
                    else 
                        {
                            document.getElementById('id').value = xml.readyState * 25
                            
                        }
                    if (xml.readyState == 4){
                            document.getElementById('btn').removeAttribute('class');
                            document.getElementById('btn').setAttribute('class', 'btn btn-success')
                    }
                }
            if (xml.status == 404)
                {
                    document.getElementById('btn').removeAttribute('class');
                    document.getElementById('btn').setAttribute('class', 'btn btn-danger')
                }
            if (xml.status == 500)
                {
                    document.getElementById('btn').removeAttribute('class');
                    document.getElementById('btn').setAttribute('class', 'btn btn-error')
                }
        }
        var name = document.getElementById('name').value;
        var lastname = document.getElementById('lastname').value;
        var hour = document.getElementById('hour').value;
        var minutes = document.getElementById('minutes').value;
        var gender = document.getElementById('gender').value;
        xml.send('name='+name
        +'&lastname='+lastname
        +'&hour='+hour
        +'&minutes='+minutes
        +'&gender='+gender
        );
    }