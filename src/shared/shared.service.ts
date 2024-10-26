import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  handleTree(permissions) {
    const childrenListMap = {};
    const nodeIds = {};
    const tree = [];
    for (const permission of permissions) {
      const parentId = permission['parentId']
      if (childrenListMap[parentId] === undefined) {
        childrenListMap[parentId] = []
      }
      nodeIds[permission['id']] = permission
      childrenListMap[parentId].push(permission)
    }

    for (const permission of permissions) {
      const parentId = permission['parentId'];
      if (nodeIds[parentId] === undefined) {
        tree.push(permission);
      }
    }

    for (const t of tree) {
      adaptToChildrenList(t);
    }
    function adaptToChildrenList(o) {
      if (childrenListMap[o['id']] !== null) {
        o['childrenList'] = childrenListMap[o['id']];
      }
      if (o['childrenList']) {
        for (const c of o['childrenList']) {
          adaptToChildrenList(c);
        }
      }
    }
    return tree
  }
}