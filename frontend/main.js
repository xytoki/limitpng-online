var _server="http://103.79.77.13:3000/";

window.filter_file_size = function (value)
{
    if (value < 1024)
    {
        return value + " B";
    }

    var z = (value / 1024);
    if (z > 1000)
    {
        return (z / 1024).toFixed(2) + " MB";
    }
    else
    {
        return (z).toFixed(2) + " KB";
    }
}

Vue.filter('filter_file_size', filter_file_size)


window.filter_file_size_pre = function (value)
{
    var pre;
    if (value > 1.001)
    {
        return "+ " + Math.floor((value - 1) * 100) + "%"
    } else
    {
        pre = (1 - value)
        if (pre < 0.01 && pre > 0)
        {
            return "- " + (pre * 100).toFixed(2) + "%";
        } else
        {
            return "- " + Math.floor(pre * 100) + "%";
        }

    }
}

Vue.filter('filter_file_size_pre', filter_file_size_pre)


var file_data = [];

//todo test
// file_data
//     = [{
//     name: "tas都是ss1.png",
//     size_old: "21233",
//     size_new: null,
//     doing: true
// },
//     {
//         name: "QWEERsadf.png",
//         size_old: "30000",
//         size_new: null
//     },
//     {
//         name: "vvvvv.png",
//         size_old: "3233",
//         size_new: "5000",
//         done: true
//
//     },
//     {
//         name: "sequence-123.png",
//         size_old: "2133233",
//         size_new: "193133",
//         perc:"",
//         done: true
//     },
//     {
//         name: "DDS. L'Huilier.png",
//         size_old: "2133233",
//         size_new: null,
//         error: true
//     }
// ]


var main_list = new Vue(
    {
        el: "#vue_app",
        data: {
            test: "ddddd",
            list: file_data,
            loading_file: false,
            tasks_doing: false,
            time: 0,


            //----
            mode: "limit",
            out: "-suffix",
            thread: 2,

        },
        methods: {
            open_file: function ()
            {
                if (v.tasks_doing)
                {
                    alert("任务进行中，不能打开文件")
                    return;
                }

                jQuery(".webuploader-element-invisible").click();
            },
            remove_all: function ()
            {
                if (v.tasks_doing == false)
                {
                    this.list = [];
                    file_data = [];
                }
            },
            task_start:function(){
                doLimiteByfile_data()
            }

        },
        computed: {
            // 一个计算属性的 getter
            list_size_old: function ()
            {
                var size = 0;
                for (var i = 0; i < this.list.length; i++)
                {
                    size = size + +this.list[i].size_old;
                }
                return size;
            },
            list_size_new: function ()
            {
                var size = 0;
                for (var i = 0; i < this.list.length; i++)
                {
                    size = size + +this.list[i].size_new;
                }
                return size;
            },
            out_dir: function ()
            {
                if (this.out[0] != undefined && this.out[0] != "-")
                {
                    return this.out;
                } else
                {
                    return "";
                }

            }
        }
        ,
        created: function ()
        {
            Vue.vueDragula.options('my-bag', {
                direction: 'vertical'
            })
        }

    }
)


window.v = main_list
window.a = file_data

const holder = document.getElementById('main_body');

holder.ondragover = function(){
    return false;
};
holder.ondragleave = holder.ondragend = function(){
    return false;
};
holder.ondrop = function(e){
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    console.log(e.dataTransfer.files);
    var ff = e.dataTransfer.files
    for(var i in ff){
        if(ff[i].type=="image/png")uploader.addFile(ff[i]);
        //
    }
    
    // console.log('File you dragged here is', file.path);
    /*main_list.loading_file = true;

    setTimeout(function ()
    {
        
        main_list.loading_file = false;
    }, 100)*/


    return false;
};


function putFile2list(files)
{

    if (files == undefined || files.length < 1)
    {
        return
    }

    var newList = [];

    for (var i = 0; i < files.length; i++)
    {
        var stat = fs.lstatSync(files[i].path);
        if (stat.isDirectory())
        {
            _scanFiles(files[i].path, fs.readdirSync(files[i].path), newList);
        }
        else
        {
            if (ifPngFile(files[i].path))
            {
                newList.push({path: files[i].path, size: files[i].size});
            }

        }
    }

    _put_list(newList);
    console.log("--------")
    console.log(newList)
    // file_data
}

function _put_list(newList)
{
    if (v.tasks_doing)
    {
        alert("任务进行中，不能添加文件")
        return;
    } else
    {

        if (file_data.length > 0)
        {
            if (file_data[0].done == true)
            {
                file_data = [];
            }
        }


    }


    for (var i = 0; i < newList.length; i++)
    {

        if (_existPath(newList[i].path,file_data) == false)
        {
            file_data.push({
                name: path.basename(newList[i].path),
                size_old: newList[i].size,
                size_new: 0,
                path: newList[i].path,
                new_File: "",
                doing: false,
                done: false,
                error: false,
                error_info: "",
                time_consum: null,
                log: "",

            });
        }


    }


    if (file_data !== undefined && file_data.length > 0)
    {
        main_list.list = file_data;

    } else
    {
        alert("拖入的文件没有图片")
    }


    function _existPath(_path, objArray)
    {
        for (var i = 0; i < objArray.length; i++)
        {
            if (objArray[i].path == _path)
            {
                return true;
            }
        }

        return false;
    }

}
function _scanFiles(dirPath, _files, newList)
{
    for (var i = 0; i < _files.length; i++)
    {
        var _path = path.join(dirPath, _files[i])

        var stat = fs.lstatSync(_path);
        if (stat.isDirectory())
        {
            _scanFiles(_path, fs.readdirSync(_path), newList);
        }
        else
        {
            if (ifPngFile(_path))
            {
                newList.push({path: _path, size: stat.size});
            }
        }
    }
}

function ifPngFile(fileName)
{
    if (path.extname(fileName).toLocaleLowerCase() == ".png")
    {
        return true
    } else
    {
        return false
    }
}


window.doLimiteByfile_data = function ()
{
    if (v.tasks_doing > 0)
    {
        return
    } else
    {

    }

    v.time = Date.now();
    var tasks = []
    window.tasks = tasks;
    var check_stat=function(i,cb){
        main_list.list[i].doing=true;
                    var ac=arguments.callee;
                    jQuery.ajax(_server+"process/"+v.mode+"/"+main_list.list[i].md5).done(function(e){
                        if(e.data==null||e.data.type=="done"){
                            main_list.list[i].doing = false;
                            main_list.list[i].done = true;
                           try{
                                main_list.list[i].size_new = e.data.data[2];
                                main_list.list[i].time_consum = e.data.data[3];
                                main_list.list[i].log = e.data.data[5];
                           }catch(e){}
                            main_list.list[i].new_File = _server+"get/"+e.id+".png";
                            /*if (err != undefined && err != "")
                            {
                                main_list.list[i].error = true;
                                main_list.list[i].error_info = err;
                            }*/
                            v.tasks_doing = v.tasks_doing - 1;
                            if (v.tasks_doing < 1)
                            {
                                v.time = (Date.now() - v.time)
                            }
                        }else{
                            setTimeout(ac.bind(ac,i),2500);
                            if(e.data.type=="pending"){
                                main_list.list[i].pending=true;
                            }else{
                                main_list.list[i].pending=false;
                            }
                        }
                    });
                };
    for (var i = 0; i < main_list.list.length; i++)
    {
        check_stat(i);
    }

}

/*
var Uploader = WebUploader.create({
    swf:  '/lib/Uploader.swf',
    server: _server+'upload',  
    pick: '#picker',  
    fileVal:"img",
    auto:true,
    resize: false,  
    accept: {  
        title: 'PNG图片',  
        extensions: 'image/png'
    }  
});
*/
WebUploader.Uploader.register({
    'before-send-file': 'preupload'
}, {
    preupload: function( file ) {
        var me = this,
            owner = this.owner,
            server = me.options.server,
            deferred = WebUploader.Deferred();
            uploader.md5File(file)
            .then(function( md5 ) {
                $.ajax(_server+"check/"+md5, {
                    dataType: 'json',
                    success: function( response ) {
                        if ( response.code==0 ) {
                            owner.skipFile( file );
                            file.md5=md5;
                            console.log('文件重复，已跳过');
                        }
                        deferred.resolve();
                    },error:function(){
                        deferred.resolve();
                    }
                });
            });

        return deferred.promise();
    }
});

window.uploader = WebUploader.create({
        resize: false,
        swf: '/static/js/Uploader.swf',
        server: _server+'upload',
        pick: '#picker',
        auto:true
    });
uploader.on( 'fileQueued', function( file ) {
    file_data.push({
                id:file.id,
                name: file.name,
                size_old: file.size,
                size_new: 0,
                new_File: "",
                doing: false,
                done: false,
                error: false,
                error_info: "",
                time_consum: null,
                log: "",
                upload:"0",
                pending:false
    });
});
uploader.on( 'uploadProgress', function( file, percentage ) {
    for(var i in file_data){
        if(file_data[i].id==file.id){
            file_data[i].upload=Math.round(percentage * 100);
            break;
        }
    }
});
uploader.on( 'uploadSuccess', function( file,res ) {
    for(var i in file_data){
        if(file_data[i].id==file.id){
            file_data[i].upload=100;
            file_data[i].md5=file.md5||res.md5;
            break;
        }
    }
});